import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET() {
  try {
    await connectToDatabase();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subject, content } = body;

    if (!title || !content || !subject) {
      return NextResponse.json({ error: 'Title, subject, and content are required' }, { status: 400 });
    }

    await connectToDatabase();
    const note = await Note.create({ title, subject, content });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
