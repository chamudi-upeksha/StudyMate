async function test() {
  // Fetch notes
  const res = await fetch('http://localhost:3000/api/notes');
  const notes = await res.json();
  console.log("Total notes:", notes.length);
  
  if (notes.length === 0) {
    console.log("No notes to edit.");
    return;
  }
  
  const firstNote = notes[0];
  console.log("Attempting to edit note with ID:", firstNote._id);
  
  // Try to edit
  const putRes = await fetch(`http://localhost:3000/api/notes/${firstNote._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: firstNote.title + ' (Edited)',
      subject: firstNote.subject,
      content: firstNote.content
    })
  });
  
  const result = await putRes.json();
  console.log("PUT status:", putRes.status);
  console.log("PUT response:", result);
}
test();
