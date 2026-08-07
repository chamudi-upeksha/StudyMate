'use client';

import { useState, useEffect } from 'react';

export default function NoteForm({ onSave, initialValues = null, onCancel = null }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setSubject(initialValues.subject || '');
      setContent(initialValues.content || '');
    } else {
      setTitle('');
      setSubject('');
      setContent('');
    }
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !subject.trim() || !content.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await onSave({ title, subject, content });
      if (!initialValues) {
        setTitle('');
        setSubject('');
        setContent('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">{initialValues ? 'Edit Note' : 'Add New Note'}</h2>
      
      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Note title"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Mathematics, History"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your notes here..."
        />
      </div>
      
      <div className="flex gap-2">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
