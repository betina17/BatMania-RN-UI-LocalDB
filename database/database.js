import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "batsDatabase.db";

// Initialize database
export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS colonies (
      id INTEGER PRIMARY KEY NOT NULL,
      time TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      description TEXT NOT NULL
    );
  `);
  return db;
};

// CRUD Operations
export const addColony = async (db, time, latitude, longitude, description) => {
  const result = await db.runAsync(
    "INSERT INTO colonies (time, latitude, longitude, description) VALUES (?, ?, ?, ?)",
    time,
    latitude,
    longitude,
    description
  );
  return result.lastInsertRowId;
};

export const getColonies = async (db) => {
  const rows = await db.getAllAsync("SELECT * FROM colonies");
  return rows;
};
export const updateColony = async (
  db, // Database instance
  id, // Colony ID
  description // New description
) => {
  try {
    const result = await db.runAsync(
      "UPDATE colonies SET description = ? WHERE id = ?",
      description, // New description
      id // Colony ID
    );
    return result; // Optionally return the result if needed
  } catch (error) {
    console.error("Error updating colony:", error);
    throw error; // Re-throw error to handle it in the component
  }
};

export const deleteColony = async (db, id) => {
  await db.runAsync("DELETE FROM colonies WHERE id = ?", id);
};
