/**
 * Committee SSE Client
 * Manages Server-Sent Events connections for real-time committee updates.
 *
 * Features:
 *   - Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s → max 30s)
 *   - Global stream (dashboard activity feed)
 *   - Per-case stream (vote tally, ownership, status)
 *   - Event listener registration/removal
 *   - Connection state tracking
 *   - Token-based authentication via query param (SSE doesn't support custom headers)
 */

const SSE_BASE = '/api/v1/backoffice/ap/committee/events';

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000, 30000];
const MAX_RETRY = RECONNECT_DELAYS.length - 1;

function getAuthToken() {
  return localStorage.getItem('authToken') || '';
}

function buildUrl(path) {
  const token = getAuthToken();
  const url = new URL(path, window.location.origin);
  if (token) url.searchParams.set('token', token);
  return url.toString();
}

class CommitteeSSEClient {
  constructor() {
    /** @type {Map<string, { es: EventSource, retries: number, listeners: Map<string, Set<Function>> }>} */
    this._streams = new Map();
    /** @type {'connected'|'connecting'|'disconnected'} */
    this._state = 'disconnected';
    this._stateListeners = new Set();
  }

  get state() {
    return this._state;
  }

  _setState(newState) {
    if (this._state === newState) return;
    this._state = newState;
    this._stateListeners.forEach(fn => {
      try { fn(newState); } catch (e) { console.error('[SSE] state listener error', e); }
    });
  }

  /**
   * Subscribe to the global event stream (dashboard).
   * Returns an unsubscribe function.
   */
  subscribeGlobal(eventHandlers = {}) {
    return this._connect('global', SSE_BASE, eventHandlers);
  }

  /**
   * Subscribe to events for a specific case.
   * Returns an unsubscribe function.
   */
  subscribeCase(caseId, eventHandlers = {}) {
    const path = `${SSE_BASE}/cases/${caseId}`;
    return this._connect(`case:${caseId}`, path, eventHandlers);
  }

  /**
   * Register a connection state listener.
   * Returns an unsubscribe function.
   */
  onStateChange(callback) {
    this._stateListeners.add(callback);
    callback(this._state); // emit current state immediately
    return () => this._stateListeners.delete(callback);
  }

  /**
   * Disconnect all streams and clean up.
   */
  disconnectAll() {
    this._streams.forEach((_, key) => this._disconnect(key));
    this._streams.clear();
    this._setState('disconnected');
  }

  // ── Internal ──────────────────────────────────────────────────────

  _connect(streamKey, path, eventHandlers) {
    // If already connected, just register handlers
    if (this._streams.has(streamKey)) {
      const stream = this._streams.get(streamKey);
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        if (!stream.listeners.has(event)) stream.listeners.set(event, new Set());
        stream.listeners.get(event).add(handler);
      });
      return () => this._unsubscribe(streamKey, eventHandlers);
    }

    this._setState('connecting');
    const listeners = new Map();
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      listeners.set(event, new Set([handler]));
    });

    const stream = { es: null, retries: 0, listeners, path };
    this._streams.set(streamKey, stream);

    this._openConnection(streamKey);

    return () => this._unsubscribe(streamKey, eventHandlers);
  }

  _openConnection(streamKey) {
    const stream = this._streams.get(streamKey);
    if (!stream) return;

    const url = buildUrl(stream.path);
    console.log(`[SSE] Connecting to ${streamKey}...`);

    const es = new EventSource(url);
    stream.es = es;

    es.onopen = () => {
      console.log(`[SSE] Connected: ${streamKey}`);
      stream.retries = 0;
      this._setState('connected');
    };

    es.onmessage = (event) => {
      // Default "message" events
      this._emit(streamKey, 'message', event.data);
    };

    es.onerror = (event) => {
      console.warn(`[SSE] Error on ${streamKey}:`, event);
      this._setState('disconnected');
      es.close();

      // Auto-reconnect with backoff
      const delay = RECONNECT_DELAYS[Math.min(stream.retries, MAX_RETRY)];
      stream.retries++;
      console.log(`[SSE] Reconnecting ${streamKey} in ${delay}ms (attempt ${stream.retries})`);

      setTimeout(() => {
        if (this._streams.has(streamKey)) {
          this._openConnection(streamKey);
        }
      }, delay);
    };

    // Listen for named events from the server
    // EventSource doesn't have a generic named-event listener,
    // so we register for each known event type
    const knownEvents = [
      'connected', 'vote_tally_updated', 'vote_cast',
      'ownership_changed', 'research_note_added',
      'case_status_changed', 'auditor_nominated',
      'activity',
    ];
    knownEvents.forEach(eventName => {
      es.addEventListener(eventName, (event) => {
        try {
          const data = JSON.parse(event.data);
          this._emit(streamKey, eventName, data);
        } catch {
          this._emit(streamKey, eventName, event.data);
        }
      });
    });
  }

  _emit(streamKey, eventName, data) {
    const stream = this._streams.get(streamKey);
    if (!stream) return;
    const handlers = stream.listeners.get(eventName);
    if (handlers) {
      handlers.forEach(fn => {
        try { fn(data); } catch (e) { console.error(`[SSE] handler error for '${eventName}':`, e); }
      });
    }
    // Also emit to wildcard listeners
    const wildcardHandlers = stream.listeners.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(fn => {
        try { fn(eventName, data); } catch (e) { console.error('[SSE] wildcard handler error:', e); }
      });
    }
  }

  _unsubscribe(streamKey, eventHandlers) {
    const stream = this._streams.get(streamKey);
    if (!stream) return;

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      const handlers = stream.listeners.get(event);
      if (handlers) handlers.delete(handler);
    });

    // If no listeners remain, disconnect
    const totalListeners = Array.from(stream.listeners.values()).reduce((sum, s) => sum + s.size, 0);
    if (totalListeners === 0) {
      this._disconnect(streamKey);
      this._streams.delete(streamKey);
    }
  }

  _disconnect(streamKey) {
    const stream = this._streams.get(streamKey);
    if (stream?.es) {
      stream.es.close();
      console.log(`[SSE] Disconnected: ${streamKey}`);
    }
  }
}

// Singleton — one client shared across the app
export const committeeSSE = new CommitteeSSEClient();
export default committeeSSE;
