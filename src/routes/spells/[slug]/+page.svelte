<script>
	import SpellCard from '$lib/components/SpellCard.svelte';

	const { data } = $props();
	const spell = data.spell;
</script>

{#if spell}
	<SpellCard {spell} />
{:else}
	<p>Spell not found.</p>
{/if}
