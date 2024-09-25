const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "database.db");

let db = null;
const initializeDb = async () => {
  try {
    if (!db) {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      await db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.run(`
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT CHECK( status IN ('pending', 'in-progress', 'completed') ) DEFAULT 'pending',
          user_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      console.log("Database connection established successfully.");
    }
    return db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = initializeDb;
