import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data/sanctum.db'));

export const POST = async ({ request }) => {
	const body = await request.json();
	const { code, mech_data } = body;

	if (!code || !mech_data) {
		return new Response('missing input: access code or mech data', { status: 400 });
	}

	const result = db
		.prepare('UPDATE mechs SET data_blob = ? WHERE access_code = ?')
		.run(JSON.stringify(mech_data), code);

	if (result.changes === 0) return new Response('wrong/invaid access code', { status: 404 });

	return new Response('Updated', { status: 200 });
};
