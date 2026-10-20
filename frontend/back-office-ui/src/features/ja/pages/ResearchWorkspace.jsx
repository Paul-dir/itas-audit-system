/**
 * ResearchWorkspace Page
 * Collaborative research notes with categories, threaded comments, and attachments.
 *
 * Features:
 * - Add timestamped research notes with categories
 * - Threaded comments on notes
 * - File attachment uploads
 * - Note feed (chronological)
 */

import { useState } from 'react';
import { useResearch } from '../hooks/useResearch';
import {
  AlertCircle, Plus, Send, Paperclip, MessageSquare,
  Search, Clock, Tag, ChevronLeft, ChevronRight, Loader,
} from 'lucide-react';
import Card from '../../../components/Card';
import RichTextEditor from '../components/RichTextEditor';

const CATEGORIES = [
  { value: 'Observation', color: 'blue' },
  { value: 'Question', color: 'amber' },
  { value: 'Investigation', color: 'purple' },
  { value: 'Recommendation', color: 'green' },
];

const CATEGORY_COLORS = {
  Observation:   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  Question:      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800',
  Investigation: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-800',
  Recommendation:'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-800',
};

export default function ResearchWorkspace() {
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteContentText, setNoteContentText] = useState('');
  const [noteCategory, setNoteCategory] = useState('Observation');
  const [searchTerm, setSearchTerm] = useState('');

  const { notes, loading, error, addingNote, totalElements, page, setPage, refresh, addNote, addCommentToNote } =
    useResearch(selectedCaseId);

  // Local state for inline comment forms
  const [openCommentNoteId, setOpenCommentNoteId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const filteredNotes = notes.filter(n => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (n.content || '').toLowerCase().includes(q) ||
      (n.category || '').toLowerCase().includes(q) ||
      (n.author || '').toLowerCase().includes(q)
    );
  });

  const handleAddNote = async () => {
    if ((!noteContentText.trim() && !noteContent.trim()) || !selectedCaseId) return;
    try {
      // Prefer HTML content if available, fall back to plain text
      const content = noteContent || noteContentText;
      await addNote(content, noteCategory);
      setNoteContent('');
      setNoteContentText('');
      setNoteCategory('Observation');
    } catch { /* handled by hook */ }
  };

  const handleAddComment = async (noteId) => {
    if (!commentText.trim()) return;
    try {
      setSubmittingComment(true);
      await addCommentToNote(noteId, commentText);
      setCommentText('');
      setOpenCommentNoteId(null);
    } catch { /* handled by hook */ } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Research Workspace</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Collaborative analysis with timestamped notes, threaded discussions, and file attachments.
          </p>
        </div>
      </div>

      {/* Case Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Case ID</label>
          <input
            type="text"
            placeholder="Enter case UUID to load research notes..."
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={refresh}
            disabled={!selectedCaseId || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : 'Load'}
          </button>
        </div>
      </Card>

      {selectedCaseId && (
        <>
          {/* Add Note Form */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus size={20} />
              Add Research Note
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-3">
                <RichTextEditor
                  value={noteContent}
                  onChange={(html, text) => { setNoteContent(html); setNoteContentText(text); }}
                  placeholder="Enter your research observation, question, or recommendation..."
                  rows={4}
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">Category</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleAddNote}
                  disabled={!noteContent.trim() || addingNote}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {addingNote ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  {addingNote ? 'Posting...' : 'Post Note'}
                </button>
              </div>
            </div>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter notes by keyword, category, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes Feed */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
                <button onClick={refresh} className="text-xs text-red-600 dark:text-red-400 mt-1 underline">Try again</button>
              </div>
            </div>
          )}

          {loading && notes.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredNotes.length === 0 && (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No research notes yet</p>
              <p className="text-sm text-gray-500 mt-1">Add the first note to begin collaborative research.</p>
            </Card>
          )}

          {filteredNotes.map((note) => (
            <Card key={note.id} className="p-6 hover:shadow-md transition-shadow">
              {/* Note Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {(note.authorName || note.author || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{note.authorName || note.author || 'Unknown'}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[note.category] || CATEGORY_COLORS.Observation}`}>
                  <Tag size={12} />
                  {note.category || 'Observation'}
                </span>
              </div>

              {/* Note Content */}
              {note.content && note.content.includes('<') ? (
                <div
                  className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              ) : (
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              )}

              {/* Comments */}
              {note.comments && note.comments.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  {note.comments.map((c, ci) => (
                    <div key={ci} className="flex gap-2 ml-8">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{c.authorName || c.author || 'Member'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              {openCommentNoteId === note.id ? (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 ml-8">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() => { setOpenCommentNoteId(null); setCommentText(''); }}
                      className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddComment(note.id)}
                      disabled={!commentText.trim() || submittingComment}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs flex items-center gap-1"
                    >
                      {submittingComment ? <Loader size={12} className="animate-spin" /> : <Send size={12} />} Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 ml-8">
                  <button
                    onClick={() => setOpenCommentNoteId(note.id)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              )}
            </Card>
          ))}

          {/* Pagination */}
          {totalElements > 25 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{totalElements} notes total</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">Page {page + 1}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * 25 >= totalElements}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state when no case selected */}
      {!selectedCaseId && (
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Select a case to begin research</p>
          <p className="text-sm text-gray-500 mt-1">Enter a case UUID above to load research notes and start collaborating.</p>
        </Card>
      )}
    </div>
  );
}
