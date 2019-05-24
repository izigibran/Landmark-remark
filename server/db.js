const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const initDB = () =>{
  db.defaults({ notes: [], users: {} })
    .write();
};

module.exports = {
  initDB,
  instance: db
};
