'use client';

import { useState, useEffect } from 'react';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';
import NoteCard from '@/components/NoteCard';

export default function NotesDashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
      if (data.length > 0 && !selectedNote && !isCreating && !editingNote) {
        setSelectedNote(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (noteData) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Failed to add note');
    const newNote = await res.json();
    setIsCreating(false);
    setSelectedNote(newNote);
    fetchNotes();
  };

  const handleEditNote = async (noteData) => {
    const res = await fetch(`/api/notes/${editingNote._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Failed to update note');
    const updated = await res.json();
    setEditingNote(null);
    setSelectedNote(updated);
    fetchNotes();
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      if (selectedNote?._id === id) setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organize Notes</h1>
          <p className="text-gray-500 mt-1">Select a topic to view or edit</p>
        </div>
        <button 
          onClick={() => { setIsCreating(true); setEditingNote(null); setSelectedNote(null); }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + New Note
        </button>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Column: Topics List */}
        <div className="w-1/3 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <input 
              type="text" 
              placeholder="Search topics or subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : (
              <NoteList 
                notes={filteredNotes} 
                selectedId={selectedNote?._id}
                onSelect={(note) => {
                  setSelectedNote(note);
                  setIsCreating(false);
                  setEditingNote(null);
                }} 
              />
            )}
          </div>
        </div>
        
        {/* Right Column: Detail View or Form */}
        <div className="w-2/3 flex flex-col overflow-y-auto">
          {isCreating ? (
            <NoteForm 
              onSave={handleAddNote} 
              onCancel={() => { setIsCreating(false); setSelectedNote(notes[0]); }} 
            />
          ) : editingNote ? (
            <NoteForm 
              initialValues={editingNote} 
              onSave={handleEditNote} 
              onCancel={() => { setEditingNote(null); setSelectedNote(editingNote); }} 
            />
          ) : selectedNote ? (
            <NoteCard 
              note={selectedNote} 
              onDelete={handleDeleteNote} 
              onEdit={() => { setEditingNote(selectedNote); setSelectedNote(null); }}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500 font-medium">Select a note to view its contents, or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
