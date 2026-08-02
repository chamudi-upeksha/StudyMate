'use client';

export default function NoteCard({ note, onDelete, onEdit }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{note.title}</h2>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">{note.subject}</span>
      </div>
      
      <div className="prose max-w-none text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed">
        {note.content}
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={() => onEdit(note)}
          className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition font-medium"
        >
          Edit Note
        </button>
        <button 
          onClick={() => onDelete(note._id)}
          className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
