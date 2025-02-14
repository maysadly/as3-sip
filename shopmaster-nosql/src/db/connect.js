const { MongoClient } = require("mongodb");


const uri = "mongodb://localhost:27017";


const dbName = "shopmasterDB";


let db;

async function connectDB() {
  if (db) return db;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log(`Connected to MongoDB at ${uri}, using database: ${dbName}`);
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
}

module.exports = { connectDB };