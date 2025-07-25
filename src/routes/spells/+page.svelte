<script>
	import { getAllSpells, getSpellcastingClassNames } from '$lib/utils/dataUtils';
	import SpellPreview from '$lib/components/spells/SpellPreview.svelte';
	import SpellCard from '$lib/components/spells/SpellCard.svelte';
	import SpellsFilter from '$lib/components/spells/SpellsFilter.svelte';

	import { page } from '$app/state';

	let class_param = page.url.searchParams.get('class');
	let level_param = page.url.searchParams.get('level');
	let school_param = page.url.searchParams.get('school');

	import { slide } from 'svelte/transition';

	const spellcasters = getSpellcastingClassNames();

	let spells = $state(getAllSpells());
	let class_filter = $state(class_param ? class_param.toLowerCase() : '');
	let level_filter = $state(
		level_param ? (level_param.toLowerCase() === 'cantrip' ? '0' : level_param) : ''
	);
	let school_filter = $state(school_param ? school_param.toLowerCase() : '');
	let name_filter = $state('');

	let filtered = $derived.by(() => {
		let filtering = spells;
		if (class_filter) {
			filtering = filtering.filter((spell) =>
				spell.classes.toLowerCase().includes(class_filter.toLowerCase())
			);
		}
		if (level_filter) {
			filtering = filtering.filter((spell) => spell.level === level_filter);
		}
		if (school_filter) {
			filtering = filtering.filter(
				(spell) => spell.school.toLowerCase() === school_filter.toLowerCase()
			);
		}
		if (name_filter) {
			filtering = filtering.filter((spell) =>
				spell.name.toLowerCase().includes(name_filter.toLowerCase())
			);
		}
		return filtering;
	});

	let openSpells = $state([]);

	function openSpellCard(slug) {
		if (!openSpells.includes(slug)) {
			openSpells.push(slug);
		}
	}

	function closeSpellCard(slug) {
		openSpells = openSpells.filter((spell) => spell !== slug);
	}
</script>

<div class="spells-wrapper">
	<h1 class="title-spells">Spells</h1>

	<SpellsFilter
		bind:class_filter
		bind:level_filter
		bind:school_filter
		bind:name_filter
		bind:openSpells
		{spellcasters}
	/>

	<div class="spell-grid">
		{#each filtered as spell}
			{#if openSpells.includes(spell.slug)}
				<div class="spell-card-cell" transition:slide>
					<SpellCard {spell} {closeSpellCard} showIcons={true} />
				</div>
			{:else}
				<div class="spell-preview-cell">
					<SpellPreview {spell} onSpellPreviewClick={() => openSpellCard(spell.slug)} />
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.spells-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.title-spells {
		font-family: 'Georgia', serif;
		font-size: 2.25rem;
		font-weight: bold;
		text-align: center;
		color: #4e342e;
		margin-bottom: 1rem;
		position: relative;
		padding-bottom: 0.5rem;
	}

	.title-spells::after {
		content: '';
		display: block;
		width: 60px;
		height: 4px;
		background-color: #a1887f;
		margin: 0.5rem auto 0;
		border-radius: 2px;
	}

	.spell-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}

	.spell-preview-cell {
		width: 100%;
	}

	.spell-card-cell {
		grid-column: 1/-1;
		width: 100%;
	}
</style>
