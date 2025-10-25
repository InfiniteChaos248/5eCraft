import Database from 'better-sqlite3';
import fs from 'node:fs';
import { DB_PATH } from '$env/static/private';

const db = new Database(fs.readFileSync(DB_PATH));

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
