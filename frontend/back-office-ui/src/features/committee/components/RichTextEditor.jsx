/**
 * RichTextEditor Component
 * Lightweight rich text editor with formatting toolbar.
 * Uses contentEditable — no external dependencies.
 *
 * Features:
 *   - Bold, italic, underline formatting
 *   - Bullet and numbered lists
 *   - Headings (H2, H3)
 *   - Blockquote
 *   - Markdown keyboard shortcuts (ctrl+b, ctrl+i, ctrl+u)
 *   - HTML output for rendering, plain text fallback for storage
 *   - Dark mode support
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3,
  Quote, Code, Minus, Type,
} from 'lucide-react';

const TOOLBAR_BUTTONS = [
  { command: 'bold', icon: Bold, label: 'Bold', shortcut: 'Ctrl+B' },
  { command: 'italic', icon: Italic, label: 'Italic', shortcut: 'Ctrl+I' },
  { command: 'underline', icon: Underline, label: 'Underline', shortcut: 'Ctrl+U' },
  { divider: true },
  { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
  { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
  { divider: true },
  { command: 'formatBlock', value: 'h2', icon: Heading2, label: 'Heading 2' },
  { command: 'formatBlock', value: 'h3', icon: Heading3, label: 'Heading 3' },
  { command: 'formatBlock', value: 'blockquote', icon: Quote, label: 'Quote' },
  { command: 'formatBlock', value: 'pre', icon: Code, label: 'Code Block' },
  { divider: true },
  { command: 'insertHorizontalRule', icon: Minus, label: 'Horizontal Rule' },
  { command: 'removeFormat', icon: Type, label: 'Clear Formatting' },
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write your note...', rows = 4 }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value into editor (only when empty or on first render)
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const execCommand = useCallback((command, value) => {
    document.execCommand(command, false, value || null);
    editorRef.current?.focus();
    emitChange();
  }, []);

  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText;
    onChange?.(html, text);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    // Markdown shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); execCommand('bold'); break;
        case 'i': e.preventDefault(); execCommand('italic'); break;
        case 'u': e.preventDefault(); execCommand('underline'); break;
        default: break;
      }
    }

    // Tab to indent
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }, [execCommand]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div className={`rounded-lg border transition-colors ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
        {TOOLBAR_BUTTONS.map((btn, idx) => {
          if (btn.divider) {
            return <div key={`d${idx}`} className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />;
          }
          const Icon = btn.icon;
          return (
            <button
              key={btn.command + (btn.value || '')}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                execCommand(btn.command, btn.value);
              }}
              title={`${btn.label}${btn.shortcut ? ` (${btn.shortcut})` : ''}`}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-label={placeholder}
        aria-multiline="true"
        data-placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={emitChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`min-h-[${rows * 1.5}rem] px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-lg focus:outline-none prose prose-sm dark:prose-invert max-w-none
          [&:empty]:before:text-gray-400 dark:[&:empty]:before:text-gray-500 [&:empty]:before:content-[attr(data-placeholder)]
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-400
          [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-xs
          [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
        `}
        style={{ minHeight: `${rows * 1.5}rem` }}
      />

      {/* Helper text */}
      <div className="px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          <strong>Bold</strong> Ctrl+B · <em>Italic</em> Ctrl+I · <u>Underline</u> Ctrl+U · Markdown shortcuts supported
        </p>
      </div>
    </div>
  );
}
