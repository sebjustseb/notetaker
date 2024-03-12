const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const readNotesFromFile = () => {
  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  return JSON.parse(notesData);
};

const writeNotesToFile = (notes) => {
  const notesString = JSON.stringify(notes);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), notesString);
};

const getNotes = (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
};

const createNote = (req, res) => {
  const newNote = req.body;
  const notes = readNotesFromFile();

  const newNoteWithId = { ...newNote, id: utils.generateUniqueId() };

  notes.push(newNoteWithId);
  writeNotesToFile(notes);
  res.json(newNoteWithId);
};

const deleteNote = (req, res) => {
  const noteId = req.params.id;
  const notes = readNotesFromFile();

  const updatedNotes = notes.filter((note) => note.id !== noteId);

  if (updatedNotes.length === notes.length) {
    res.status(404).json({ error: `Note with id ${noteId} not found` });
  } else {
    writeNotesToFile(updatedNotes);
    res.json({ message: `Note with id ${noteId} deleted` });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};