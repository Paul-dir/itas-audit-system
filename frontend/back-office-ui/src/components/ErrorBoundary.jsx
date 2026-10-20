import { Component } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ChevronDown } from 'lucide-react';

/**
 * Global ErrorBoundary
 *
 * Catches any render-time crash in the React tree below it and shows a
 * recoverable error panel instead of a blank page. Users can either retry
 * the failed subtree in-place ("Try Again") or fully reload the app.
 *
 * Usage (main.jsx): wrap the outermost provider tree.
 *
 * Note: React error boundaries only catch errors during rendering, lifecycle
 * methods, and constructors. Errors in event handlers or async callbacks must
 * be handled where they occur (they do NOT reach this boundary).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the full stack (including the React component stack) in the console
    // so crashes remain debuggable in devtools.
    console.error('[ErrorBoundary] Uncaught render error:', error, info);
    this.setState({ info });
  }

  handleRetry = () => {
    this.setState({ error: null, info: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    const message = error?.message || String(error);
    const componentStack = info?.componentStack || '';

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The interface hit an unexpected error. Your data is safe.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can try again — if the error persists, reload the page or
              sign out and back in. The details below help developers diagnose
              the issue.
            </p>

            <div className="rounded-lg bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 px-3 py-2.5">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 font-mono break-words">
                {message}
              </p>
              {componentStack && (
                <details className="mt-2 group">
                  <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                    <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                    Component stack
                  </summary>
                  <pre className="mt-2 text-[10px] leading-relaxed text-gray-400 dark:text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {componentStack.trim()}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-600">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Reload Page
            </button>
            <button
              onClick={this.handleRetry}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
