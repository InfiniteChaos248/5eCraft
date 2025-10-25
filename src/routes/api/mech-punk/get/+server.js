import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename);
console.log(__dirname);

// Construct absolute path to DB
const dbDir = join(__dirname, '../../../data');
const dbPath = join(dbDir, 'sanctum.db');

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

console.log(dbPath);
const db = new Database(dbPath);

export const GET = ({ url }) => {
	const code = url.searchParams.get('code');
	if (!code) return new Response('missing input: access code', { status: 400 });

	let row = db
		.prepare(
			'SELECT access_code, view_code, data_blob FROM mechs WHERE access_code = ? OR view_code = ?'
		)
		.get(code, code);
	if (!row) return new Response('Mech not found', { status: 404 });

	let response = {};
	response.mech_data = row.data_blob;
	if (row.view_code === code) {
		response.read_only = true;
	} else {
		response.code = code;
		response.read_only = false;
	}

	return new Response(JSON.stringify(response), { status: 200 });
};
