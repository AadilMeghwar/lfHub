import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'lfhub.sqlite'));

db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 full_name TEXT NOT NULL,
 student_id TEXT NOT NULL UNIQUE,
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 phone TEXT DEFAULT '',
 bio TEXT DEFAULT '',
 match_alerts INTEGER NOT NULL DEFAULT 1,
 messages INTEGER NOT NULL DEFAULT 1,
 weekly_summary INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reports (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 type TEXT NOT NULL CHECK(type IN ('LOST','FOUND')),
 item_name TEXT NOT NULL,
 category TEXT NOT NULL,
 description TEXT NOT NULL,
 brand TEXT DEFAULT '',
 color TEXT DEFAULT '',
 location TEXT NOT NULL,
 report_date TEXT NOT NULL,
 time TEXT DEFAULT '',
 location_details TEXT DEFAULT '',
 contact_name TEXT DEFAULT '',
 contact_email TEXT DEFAULT '',
 contact_phone TEXT DEFAULT '',
 urgent INTEGER NOT NULL DEFAULT 0,
 handoff_preference TEXT DEFAULT '',
 pickup_point TEXT DEFAULT '',
 status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','RESOLVED')),
 views INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notifications (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 type TEXT NOT NULL,
 title TEXT NOT NULL,
 text TEXT NOT NULL,
 cta TEXT DEFAULT 'View',
 unread INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);
export default db;
