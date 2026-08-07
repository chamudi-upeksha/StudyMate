import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this note.'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject for this note.'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this note.'],
  },
  summary: {
    bullets: [String],
    quizQuestion: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
