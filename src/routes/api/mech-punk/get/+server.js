import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data/sanctum.db'));

export const GET = ({ url }) => {
	const code = url.searchParams.get('code');
	const name = url.searchParams.get('name');
	if (!code || !name) return new Response('Missing code or name', { status: 400 });

	const row = db.prepare('SELECT data_blob FROM mechs WHERE code = ? AND name = ?').get(code, name);
	if (!row) return new Response('Mech not found', { status: 404 });

	return new Response(row.data_blob, { status: 200 });
};
