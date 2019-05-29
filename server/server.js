const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const cors = require('cors');

const db = require('./db');
db.initDB();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/sign-up', (req, res) => {
  const {user, pass} = req.body;
  if(db.instance.get(`users.${user}`).value()){
    return res.status(403).send('User already taken');
  } else{
    db.instance.set(`users.${user}`, pass).write();
    return res.json({ 'message': "user created" });
  }
});

app.post('/login', (req, res) => {
  const {user, pass} = req.body;
  if(db.instance.get(`users.${user}`).value()){
    const passFound = db.instance.get(`users.${user}`).value();
    if(passFound !== pass)return res.sendStatus(404);
    return res.json({ 'message': "authorized" });
  } else{
   return res.sendStatus(404);
  }
});

app.use(basicAuth({
  users: db.instance.get('users').value()
}));

app.post('/note', (req, res) => {
  let existingNotes = [];
  const {user, lng, lat, note} = req.body;
  if(user && lng && lat && note) {
    let dbNotes = db.instance.get('notes').value();
    if(dbNotes.length === 0){
      db.instance.get('notes').push({user, lng, lat, notes:[note]}).write();
    } else {
      if(!db.instance.get('notes').find({ user: user, lng:lng , lat: lat  }).value()){
        db.instance.get('notes').push({user, lng, lat, notes:[note]}).write();
      } else {
        existingNotes = db.instance.get('notes').find({ user: 'one', lng: lng , lat: lat }).value().notes;
        db.instance.get('notes').find({ user: user, lng:lng , lat: lat  }).assign({ notes: [...existingNotes, note]}).write()
      }
    }
    res.json({ 'status': 200 });
  } else {
    return res.sendStatus(400);
  }
});

app.get('/notes/all', (req, res) => {
  const notes = db.instance.get('notes').value();
  res.json({ 'user_notes': notes });
});

app.get('/search/user/notes/:user', (req, res) => {
  const allNotes = db.instance.get('notes').value();
  const userNotes = allNotes.filter(u => u.user === req.params.user);
  res.json(userNotes);
});

app.get('/search/notes/:text', (req, res) => {
  const regex = new RegExp( req.params.text, 'ig' );
  const allNotes = db.instance.get('notes').value();
  const foundNotesByText =  allNotes.filter(loc => loc.notes.some(n => n.match(regex) && n.match(regex)));
  res.json(foundNotesByText);
});

app.listen(8899);
console.log('======== Sever Started on port 8899 ======');
