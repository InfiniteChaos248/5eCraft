import { getSpellBySlug } from '$lib/utils/dataUtils';

export const load = ({ params }) => {
	const spell = getSpellBySlug(params.slug);

	if (!spell) {
		throw new Error('Spell not found');
	}

	return { spell };
};
