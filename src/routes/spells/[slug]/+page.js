import { getSpellBySlug } from '$lib/utils/dataUtils';

export const load = ({ params }) => {
	const slug = params.slug;
	const spell = getSpellBySlug(slug);
	return { spell, slug };
};
