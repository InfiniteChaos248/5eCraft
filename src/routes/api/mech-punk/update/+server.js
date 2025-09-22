import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data/sanctum.db'));

export const POST = async ({ request }) => {
	const body = await request.json();
	const { code, name, data } = body;

	if (!code || !name || !data) {
		return new Response('Missing code, name, or data', { status: 400 });
	}

	const result = db
		.prepare('UPDATE mechs SET data_blob = ? WHERE code = ? AND name = ?')
		.run(JSON.stringify(data), code, name);

	if (result.changes === 0) return new Response('Mech not found', { status: 404 });

	return new Response('Updated', { status: 200 });
};
