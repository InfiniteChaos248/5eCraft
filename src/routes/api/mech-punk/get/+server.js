import { getDB } from '$lib/db.server.js';

export const GET = ({ url }) => {
	const code = url.searchParams.get('code');
	if (!code) return new Response('missing input: access code', { status: 400 });

	const db = getDB();

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
