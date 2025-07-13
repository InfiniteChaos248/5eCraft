<script>
	import { getAllFeats } from '$lib/utils/dataUtils';
	import FeatPreview from '$lib/components/feats/FeatPreview.svelte';
	import FeatCard from '$lib/components/feats/FeatCard.svelte';
	import FeatsFilter from '$lib/components/feats/FeatsFilter.svelte';

	import { slide } from 'svelte/transition';

	let feats = $state(getAllFeats());
	let sources = [...new Set(feats.map((feat) => feat.source))];
	sources.sort();
	let source_filter = $state('');
	let prereq_filter = $state(false);
	let name_filter = $state('');

	let filtered = $derived.by(() => {
		let filtering = feats;
		if (source_filter) {
			filtering = filtering.filter((feat) => feat.source.includes(source_filter));
		}
		if (prereq_filter) {
			filtering = filtering.filter((feat) => feat.prerequisite === '');
		}
		if (name_filter) {
			filtering = filtering.filter((feat) =>
				feat.name.toLowerCase().includes(name_filter.toLowerCase())
			);
		}
		return filtering;
	});

	let openFeats = $state([]);

	function openFeatCard(slug) {
		if (!openFeats.includes(slug)) {
			openFeats.push(slug);
		}
	}

	function closeFeatCard(slug) {
		openFeats = openFeats.filter((feat) => feat !== slug);
	}
</script>

<div class="feats-wrapper">
	<h1 class="title-feats">Feats</h1>

	<FeatsFilter bind:source_filter bind:prereq_filter bind:name_filter bind:openFeats {sources} />

	<div class="feat-grid">
		{#each filtered as feat}
			{#if openFeats.includes(feat.slug)}
				<div class="feat-card-cell" transition:slide>
					<FeatCard {feat} {closeFeatCard} showIcons={true} />
				</div>
			{:else}
				<div class="feat-preview-cell">
					<FeatPreview {feat} onFeatPreviewClick={() => openFeatCard(feat.slug)} />
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.feats-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.title-feats {
		font-family: 'Georgia', serif;
		font-size: 2.25rem;
		font-weight: bold;
		text-align: center;
		color: #4e342e;
		margin-bottom: 1rem;
		position: relative;
		padding-bottom: 0.5rem;
	}

	.title-feats::after {
		content: '';
		display: block;
		width: 60px;
		height: 4px;
		background-color: #a1887f;
		margin: 0.5rem auto 0;
		border-radius: 2px;
	}

	.feat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}

	.feat-preview-cell {
		width: 100%;
	}

	.feat-card-cell {
		grid-column: 1/-1;
		width: 100%;
	}
</style>
