'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, X, Save, Trash2 } from 'lucide-react';

interface NotePanelProps {
  lessonSlug: string;
  sectionIndex: number;
  sectionTitle: string;
}

export function NotePanel({ lessonSlug, sectionIndex, sectionTitle }: NotePanelProps) {
  const storageKey = `note:${lessonSlug}:${sectionIndex}`;
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [hasNote, setHasNote] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNote(saved);
      setHasNote(true);
      setLastSaved(new Date().toISOString());
    }
  }, [storageKey]);

  const saveNote = useCallback(() => {
    if (note.trim()) {
      localStorage.setItem(storageKey, note.trim());
      setHasNote(true);
      setLastSaved(new Date().toISOString());
    } else {
      localStorage.removeItem(storageKey);
      setHasNote(false);
      setLastSaved(null);
    }
  }, [note, storageKey]);

  const deleteNote = useCallback(() => {
    localStorage.removeItem(storageKey);
    setNote('');
    setHasNote(false);
    setLastSaved(null);
    setIsOpen(false);
  }, [storageKey]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Note indicator / button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all duration-200 ${
          hasNote
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
        }`}
        title={hasNote ? 'Edit note' : 'Add note'}
      >
        <Pencil size={14} />
        {hasNote && (
          <span className="text-xs font-medium">Note</span>
        )}
      </button>

      {/* Note panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50 glass-card rounded-xl p-4 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white/90">
              📝 Note on: {sectionTitle}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <X size={16} />
            </button>
          </div>
          
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your note, question, or confusion here..."
            className="w-full h-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
            autoFocus
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-white/40">
              {lastSaved && (
                <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasNote && (
                <button
                  onClick={deleteNote}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              )}
              <button
                onClick={saveNote}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition"
              >
                <Save size={12} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NoteSummary({ lessonSlug }: { lessonSlug: string }) {
  const [notes, setNotes] = useState<{ index: number; content: string; title: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const allNotes: { index: number; content: string; title: string }[] = [];
    for (let i = 0; i < 50; i++) { // reasonable upper limit
      const key = `note:${lessonSlug}:${i}`;
      const content = localStorage.getItem(key);
      if (content) {
        allNotes.push({ index: i, content, title: '' });
      }
    }
    setNotes(allNotes);
  }, [lessonSlug, isOpen]);

  if (notes.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition"
      >
        <Pencil size={14} />
        {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
        <span className="text-white/40 ml-1">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="mt-3 glass-card rounded-xl p-4 border border-amber-500/10">
          <div className="space-y-2">
            {notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                <span className="text-xs text-white/40 mt-0.5">Section {note.index + 1}</span>
                <p className="text-sm text-white/80">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
