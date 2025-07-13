<script>
	let {
		source_filter = $bindable(),
		prereq_filter = $bindable(),
		name_filter = $bindable(),
		openFeats = $bindable(),
		sources
	} = $props();
</script>

<div class="feat-filters">
	<div class="filter-info"><strong>FILTER</strong></div>
	<select class="filter-select" bind:value={source_filter}>
		<option value="">-- source --</option>
		{#each sources as src}
			<option value={src}>{src}</option>
		{/each}
	</select>

	<label class="checkbox-container">
		<input type="checkbox" bind:checked={prereq_filter} />
		<span class="checkbox-label">Exclude feats with prerequisites?</span>
	</label>

	<input class="filter-input" type="text" placeholder="feat name .." bind:value={name_filter} />

	<button
		class="clear-button"
		onclick={() => {
			source_filter = '';
			prereq_filter = '';
			name_filter = '';
			openFeats = [];
		}}>clear</button
	>
</div>

<style>
	.feat-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		background-color: #1f2937; /* Dark background */
		border: 2px solid #374151; /* Slightly lighter border */
		padding: 1rem;
		border-radius: 10px;
		margin-bottom: 1.5rem;
		font-family: 'Segoe UI', sans-serif;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		width: fit-content;
	}

	.filter-info {
		padding: 0.5rem 0.75rem;
		font-size: 0.95rem;
		color: #d1d5db; /* Light gray text */
		font-family: inherit;
	}

	.filter-input,
	.filter-select {
		padding: 0.5rem 0.75rem;
		border: 1px solid #4b5563;
		border-radius: 6px;
		font-size: 0.95rem;
		background-color: #111827;
		color: #f3f4f6;
		font-family: inherit;
		min-width: 180px;
	}

	.filter-input:focus,
	.filter-select:focus {
		outline: none;
		border-color: #818cf8;
		box-shadow: 0 0 0 2px #6366f1;
	}

	.filter-input::placeholder {
		color: #f3f4f6;
		opacity: 0.5;
	}

	.clear-button {
		background-color: #374151;
		color: #e5e7eb;
		font-weight: 600;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.2s;
	}

	.clear-button:hover {
		background-color: #4b5563;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
		margin: 0.25rem 0;
	}

	input[type='checkbox'] {
		appearance: none;
		width: 1rem;
		height: 1rem;
		border: 2px solid #818cf8;
		border-radius: 4px;
		background-color: #1f2937;
		transition:
			background-color 0.2s,
			box-shadow 0.2s;
		position: relative;
	}

	input[type='checkbox']:checked {
		background-color: #818cf8;
		box-shadow: 0 0 0 2px #4f46e5;
	}

	input[type='checkbox']:checked::after {
		content: '✓';
		position: absolute;
		top: 0.05rem;
		left: 0.2rem;
		color: white;
		font-size: 0.75rem;
	}

	.checkbox-label {
		color: #e5e7eb;
		font-size: 1rem;
	}
</style>
