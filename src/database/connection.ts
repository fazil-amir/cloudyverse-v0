import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Global database instance
let db: Database.Database | null = null;

// Check if database exists (for startup)
export const checkDatabaseExists = () => {
  const dbPath = path.join(process.cwd(), 'database.db');
  return fs.existsSync(dbPath);
};

// Get database path
export const getDatabasePath = () => {
  return path.join(process.cwd(), 'database.db');
};

// Initialize database connection (only if database exists)
export const initDatabase = () => {
  // Close existing database connection if any
  if (db) {
    db.close();
    db = null;
  }

  const dbPath = getDatabasePath();
  
  if (!fs.existsSync(dbPath)) {
    console.log('Database does not exist. Setup required.');
    return false;
  }

  // Create new database connection
  db = new Database(dbPath);
  console.log(`Database connected successfully at: ${dbPath}`);
  return true;
};

// Create database during setup
export const createDatabase = () => {
  // Close existing database connection if any
  if (db) {
    db.close();
    db = null;
  }

  // Database will be at root level
  const dbPath = path.join(process.cwd(), 'database.db');

  // Create new database connection
  db = new Database(dbPath);

  // Create test table
  db.exec(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      random_string TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table (simplified for single company)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      home_directory TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create storage backends table
  db.exec(`
    CREATE TABLE IF NOT EXISTS storage_backends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      backend_type TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      enabled BOOLEAN DEFAULT 0,
      is_current BOOLEAN DEFAULT 0,
      config TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default storage backends
  db.exec(`
    INSERT OR IGNORE INTO storage_backends (backend_type, name, enabled, is_current, config) VALUES
    ('LOCAL', 'Local File System', 1, 1, '{}'),
    ('S3', 'AWS S3', 0, 0, '{"bucket":"","region":"","accessKeyId":"","secretAccessKey":""}'),
    ('R2', 'Cloudflare R2', 0, 0, '{"bucket":"","accountId":"","accessKeyId":"","secretAccessKey":""}'),
    ('WASABI', 'Wasabi Cloud Storage', 0, 0, '{"bucket":"","region":"","accessKeyId":"","secretAccessKey":""}')
  `);

  console.log(`Database created successfully at: ${dbPath}`);
  return true;
};

// Get the current database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Get the root directory path (for shared files)
export const getRootDirectory = () => {
  return path.join(process.cwd(), '/');
};

// Get file storage directory (single folder for all users)
export const getFileDirectory = (homeDirectory: string) => {
  const filesDir = path.join(process.cwd(), homeDirectory);
  return filesDir;
};

// Create file directory if it doesn't exist
export const ensureFileDirectory = (homeDirectory: string) => {
  const filesDir = getFileDirectory(homeDirectory);
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }
  return filesDir;
};

// Close database connection
export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};

// Default export for backward compatibility
export default getDatabase; 