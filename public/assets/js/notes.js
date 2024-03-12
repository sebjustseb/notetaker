const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-text');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const deleteNoteBtn = document.querySelector('.delete-note');
const noteList = document.querySelector('.note-list');

let notes = [];
let currentNoteId = null;

// Read notes from the server
const getNotes = async () => {
  const response = await fetch('/api/notes');
  notes = await response.json();
  renderNotes();
};

// Render notes in the list
const renderNotes = () => {
  noteList.innerHTML = '';
  notes.forEach((note) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = note.title;
    li.addEventListener('click', () => showNote(note.id));
    noteList.appendChild(li);
  });
};

// Show a note in the form
const showNote = (id) => {
  currentNoteId = id;
  const note = notes.find((note) => note.id === id);
  noteTitle.value = note.title;
  noteText.value = note.text;
};

// Create a new note
const createNote = async () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  });
  const createdNote = await response.json();
  notes.push(createdNote);
  renderNotes();
  clearForm();
};

// Update an existing note
const updateNote = async () => {
  const updatedNote = {
    id: currentNoteId,
    title: noteTitle.value,
    text: noteText.value,
  };
  await fetch(`/api/notes/${currentNoteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedNote),
  });
  const noteIndex = notes.findIndex((note) => note.id === currentNoteId);
  notes[noteIndex] = updatedNote;
  renderNotes();
};

// Delete a note
const deleteNote = async () => {
  await fetch(`/api/notes/${currentNoteId}`, {
    method: 'DELETE',
  });
  notes = notes.filter((note) => note.id !== currentNoteId);
  renderNotes();
  clearForm();
};

// Clear the form fields
const clearForm = () => {
  noteTitle.value = '';
  noteText.value = '';
  currentNoteId = null;
};

// Event listeners
saveNoteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentNoteId) {
    updateNote();
  } else {
    createNote();
  }
});

newNoteBtn.addEventListener('click', () => {
  clearForm();
});

deleteNoteBtn.addEventListener('click', () => {
  if (currentNoteId) {
    deleteNote();
  }
});

// Initialize the application
getNotes();