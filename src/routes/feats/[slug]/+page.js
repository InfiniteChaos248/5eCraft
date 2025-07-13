import { getFeatBySlug } from '$lib/utils/dataUtils';

export const load = ({ params }) => {
	const slug = params.slug;
	const feat = getFeatBySlug(slug);
	return { feat, slug };
};
