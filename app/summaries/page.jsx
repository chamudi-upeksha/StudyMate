'use client';

import { useState, useEffect } from 'react';

export default function SummariesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error(err));
  }, []);

  const handleSummarize = async () => {
    if (!selectedNote) return;
    setIsSummarizing(true);
    
    try {
      const res = await fetch(`/api/notes/${selectedNote._id}/summarize`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to summarize');
      const updated = await res.json();
      
      // Update local state
      setSelectedNote(updated);
      setNotes(notes.map(n => n._id === updated._id ? updated : n));
      setIsSummaryOpen(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Summaries</h1>
        <p className="text-gray-600">Select a note to generate a concise, easy-to-read summary.</p>
      </div>
      
      <div className="flex flex-1 gap-8 min-h-0">
        {/* Left Column: Select Note */}
        <div className="w-1/3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4 px-2 shrink-0">Your Notes</h3>
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
            {notes.map(note => (
              <button
                key={note._id}
                onClick={() => setSelectedNote(note)}
                className={`text-left p-3 rounded-lg border transition ${
                  selectedNote?._id === note._id 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-white border-gray-100 hover:border-purple-200'
                }`}
              >
                <div className="font-medium text-gray-900 truncate">{note.title}</div>
                <div className="text-xs text-gray-500 mt-1">{note.subject}</div>
              </button>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No notes available.</p>
            )}
          </div>
        </div>

        {/* Right Column: View and Summarize */}
        <div className="w-2/3 overflow-y-auto">
          {selectedNote ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedNote.title}</h2>
                  <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{selectedNote.subject}</span>
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSummarizing ? 'Generating...' : '✨ Summarize Note'}
                </button>
              </div>

              {/* Collapsible Summary Section */}
              {selectedNote.summary && selectedNote.summary.bullets && selectedNote.summary.bullets.length > 0 && (
                <div className="mb-8 border border-purple-200 rounded-xl overflow-hidden bg-purple-50 shadow-sm">
                  <button 
                    onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                    className="w-full px-6 py-4 flex justify-between items-center bg-purple-100/50 hover:bg-purple-100 transition"
                  >
                    <h3 className="font-bold text-purple-900 flex items-center gap-2">
                      ✨ AI Generated Summary
                    </h3>
                    <span className="text-purple-600 font-bold">{isSummaryOpen ? '− Minimize' : '+ Expand'}</span>
                  </button>
                  
                  {isSummaryOpen && (
                    <div className="p-6 text-purple-900">
                      <ul className="list-disc pl-5 space-y-3">
                        {selectedNote.summary.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap mt-4 opacity-80">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Original Content</h4>
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl py-20">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-gray-500 font-medium">Select a note from the left to summarize it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
