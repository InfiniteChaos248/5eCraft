<script>
	import FeatCard from '$lib/components/feats/FeatCard.svelte';
	import NotFound from '$lib/components/NotFound.svelte';

	const { data } = $props();
	const feat = data.feat;
	const slug = data.slug;
</script>

{#if feat}
	<FeatCard {feat} />
{:else}
	<NotFound name={slug} content="Feat" />
{/if}
