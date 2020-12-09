const MongoClient = require('mongodb').MongoClient;
const dbUrl = require('../config');

const dbName = process.env.DB_NAME;
var connectedDB = null;

async function getCollection(collectionName) {
  const db = await _connect();
  return db.collection(collectionName);
}

async function _connect() {
  if (connectedDB) return connectedDB;
  try {
    const client = await MongoClient.connect(dbUrl, {
      useNewUrlParser: true,
    });
    connectedDB = client.db(dbName);
    return connectedDB;
  } catch (err) {
    console.log(`Problem Connecting ${dbName}, exiting... `);
    throw err;
  }
}

module.exports = {
  getCollection,
};
