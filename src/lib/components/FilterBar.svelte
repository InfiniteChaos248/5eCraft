<script>
	let {
		class_filter = $bindable(),
		level_filter = $bindable(),
		school_filter = $bindable(),
		name_filter = $bindable(),
		spellcasters
	} = $props();
</script>

<div class="spell-filters">
	<div class="filter-info"><strong>FILTER</strong></div>
	<select class="filter-select" bind:value={class_filter}>
		<option value="">-- class --</option>
		{#each spellcasters as cls}
			<option value={cls}>{cls}</option>
		{/each}
	</select>

	<select class="filter-select" bind:value={level_filter}>
		<option value="">-- spell level --</option>
		<option value="0">Cantrip</option>
		<option value="1">Level 1</option>
		<option value="2">Level 2</option>
		<option value="3">Level 3</option>
		<option value="4">Level 4</option>
		<option value="5">Level 5</option>
		<option value="6">Level 6</option>
		<option value="7">Level 7</option>
		<option value="8">Level 8</option>
		<option value="9">Level 9</option>
	</select>

	<select class="filter-select" bind:value={school_filter}>
		<option value="">-- school of magic --</option>
		<option value="Abjuration">Abjuration</option>
		<option value="Conjuration">Conjuration</option>
		<option value="Divination">Divination</option>
		<option value="Enchantment">Enchantment</option>
		<option value="Evocation">Evocation</option>
		<option value="Illusion">Illusion</option>
		<option value="Necromancy">Necromancy</option>
		<option value="Transmutation">Transmutation</option>
	</select>

	<input class="filter-input" type="text" placeholder="spell name .." bind:value={name_filter} />

	<button
		class="clear-button"
		onclick={() => {
			class_filter = '';
			level_filter = '';
			school_filter = '';
			name_filter = '';
		}}>clear</button
	>
</div>

<style>
	.spell-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		background-color: #fdf8e4;
		border: 2px solid #d7ccc8;
		padding: 1rem;
		border-radius: 10px;
		margin-bottom: 1.5rem;
		font-family: 'Georgia', serif;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		width: fit-content;
	}

	.filter-info {
		padding: 0.5rem 0.75rem;
		font-size: 0.95rem;
		color: #4e342e;
		font-family: inherit;
	}

	.filter-input,
	.filter-select {
		padding: 0.5rem 0.75rem;
		border: 1px solid #c8b69f;
		border-radius: 6px;
		font-size: 0.95rem;
		background-color: #fffdf7;
		color: #4e342e;
		font-family: inherit;
		min-width: 180px;
	}

	.filter-input:focus,
	.filter-select:focus {
		outline: none;
		border-color: #a1887f;
		box-shadow: 0 0 0 2px #efebe9;
	}

	.clear-button {
		background-color: #d7ccc8;
		color: #4e342e;
		font-weight: 600;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.2s;
	}

	.clear-button:hover {
		background-color: #c7b29b;
	}
</style>
