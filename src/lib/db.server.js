import Database from 'better-sqlite3';
import path from 'node:path';
import { DB_PATH } from '$env/static/private';

let db;

export function getDB() {
	if (!db) {
		const dbFile = path.resolve(DB_PATH);
		db = new Database(dbFile);
	}
	return db;
}
