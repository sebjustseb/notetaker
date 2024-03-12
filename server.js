const express = require('express');
const path = require('path');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes
app.get('/api/notes', noteRoutes.getNotes);
app.post('/api/notes', noteRoutes.createNote);
app.delete('/api/notes/:id', noteRoutes.deleteNote);

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to read and parse the notes from the db.json file
const readNotesFromFile = () => {
    const notesData = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(notesData);
  };
  
  // Helper function to write the notes to the db.json file
  const writeNotesToFile = (notes) => {
    const notesString = JSON.stringify(notes);
    fs.writeFileSync(path.join(__dirname, 'db.json'), notesString);
  };
  
  // GET /api/notes - Read all notes
  app.get('/api/notes', (req, res) => {
    const notes = readNotesFromFile();
    res.json(notes);
  });
  
  // POST /api/notes - Create a new note
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = readNotesFromFile();
  
    // Generate a unique id for the new note
    const newNoteWithId = { ...newNote, id: generateUniqueId() };
  
    notes.push(newNoteWithId);
    writeNotesToFile(notes);
    res.json(newNoteWithId);
  });
  
  // DELETE /api/notes/:id - Delete a note by id
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const notes = readNotesFromFile();
  
    const updatedNotes = notes.filter((note) => note.id !== noteId);
  
    if (updatedNotes.length === notes.length) {
      res.status(404).json({ error: `Note with id ${noteId} not found` });
    } else {
      writeNotesToFile(updatedNotes);
      res.json({ message: `Note with id ${noteId} deleted` });
    }
  });