import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`DELETE error:`, error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subject, content } = body;

    if (!title || !content || !subject) {
      return NextResponse.json({ error: 'Title, subject, and content are required' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, subject, content },
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/notes/${params.id} error:`, error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}
