import { type SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS swimmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gender TEXT NOT NULL,
            year_of_birth INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            distance INTEGER NOT NULL,
            stroke TEXT NOT NULL,
            course TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS times (
            swimmer_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            time TEXT,
            PRIMARY KEY (swimmer_id, event_id),
            FOREIGN KEY (swimmer_id) REFERENCES swimmers(id),
            FOREIGN KEY (event_id) REFERENCES events(id)
        );
        `)
}