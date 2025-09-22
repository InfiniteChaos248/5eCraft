import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data/sanctum.db'));

export const GET = ({ url }) => {
	const code = url.searchParams.get('code');
	if (!code) return new Response('Missing code', { status: 400 });

	const rows = db.prepare('SELECT name FROM mechs WHERE code = ?').all(code);
	const names = rows.map((r) => r.name);
	return new Response(JSON.stringify(names), { status: 200 });
};
