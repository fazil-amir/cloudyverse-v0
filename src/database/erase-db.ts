import { getDatabase } from './connection.js';

console.log('Erasing all database entries...');

const db = getDatabase();
db.exec(`
  DELETE FROM users;
  DELETE FROM platform_settings;
  DELETE FROM storage_backends;
  DELETE FROM test;
`);

console.log('All database entries erased.'); 