const Client = require("@replit/database");
const db = new Client();
const config = require('../config.json');

function updateDatabase(key, value) {
  db.set(key, value);
}

function getDatabase(key) {
  return db.get(key);
}

function showAll() {
  return db.getAll();
}

function resetDatabase() {
  db.empty();
}

module.exports = { updateDatabase, getDatabase, showAll, resetDatabase };