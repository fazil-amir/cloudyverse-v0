import { getDatabase } from '@/database/connection.js';
import { generateRandomString } from '@/utils/random-string.util.js';

export const testModel = {
  // Create a new test record
  create: () => {
    const db = getDatabase();
    const randomString = generateRandomString();
    const stmt = db.prepare('INSERT INTO test (random_string) VALUES (?)');
    return stmt.run(randomString);
  },

  // Get all test records
  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT id, random_string, created_at 
      FROM test 
      ORDER BY created_at DESC
    `);
    return stmt.all() as Array<{
      id: number;
      random_string: string;
      created_at: string;
    }>;
  },

  // Get total count
  getCount: () => {
    const db = getDatabase();
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM test');
    const result = countStmt.get() as { total: number };
    return result.total;
  },

  // Get test record by ID
  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM test WHERE id = ?');
    return stmt.get(id) as {
      id: number;
      random_string: string;
      created_at: string;
    } | undefined;
  },

  // Check if test table has records
  hasRecords: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM test');
    const result = stmt.get() as { count: number };
    return result.count > 0;
  },

  // Delete test record by ID
  deleteById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM test WHERE id = ?');
    return stmt.run(id);
  }
}; 