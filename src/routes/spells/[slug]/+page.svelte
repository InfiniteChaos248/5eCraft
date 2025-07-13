<script>
	import SpellCard from '$lib/components/spells/SpellCard.svelte';
	import NotFound from '$lib/components/NotFound.svelte';

	const { data } = $props();
	const spell = data.spell;
	const slug = data.slug;
</script>

{#if spell}
	<SpellCard {spell} />
{:else}
	<NotFound name={slug} content="Spell" />
{/if}
