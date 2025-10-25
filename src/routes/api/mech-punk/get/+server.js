import Database from 'better-sqlite3';
import fs from 'node:fs';
import { DB_PATH } from '$env/static/private';

const db = new Database(fs.readFileSync(DB_PATH));

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
