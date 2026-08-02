'use client';

export default function NoteList({ notes, onSelect, selectedId }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No notes found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map(note => (
        <button 
          key={note._id}
          onClick={() => onSelect(note)}
          className={`text-left p-4 rounded-lg border transition-all ${
            selectedId === note._id 
              ? 'bg-blue-50 border-blue-200 shadow-sm' 
              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <h4 className={`font-semibold truncate ${selectedId === note._id ? 'text-blue-900' : 'text-gray-800'}`}>
              {note.title}
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {note.subject}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
