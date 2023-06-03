const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
  });
  
  // Serve the notes.html file
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
  });

 // Read all saved notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes.' });
      } else {
        const notes = JSON.parse(data);
        res.json(notes);
      }
    });
  });
  
  // Save a new note to db.json
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
  
    fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save note.' });
      } else {
        const notes = JSON.parse(data);
        notes.push(newNote);
  
        fs.writeFile(
          path.join(__dirname, 'Develop', 'db', 'db.json'),
          JSON.stringify(notes),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to save note.' });
            } else {
              res.json(newNote);
            }
          }
        );
      }
    });
  });
  
  const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

