<script>
	let { mech, selectedMech = $bindable() } = $props();
	let autoAccOpen = $state(false);
</script>

<div class="section automation-section">
	<button
		class="accordion-header"
		onclick={() => (autoAccOpen = !autoAccOpen)}
		aria-expanded={autoAccOpen}
	>
		<span class="accordion-title">Automation Functions</span>
		{#if !autoAccOpen}
			<span class="accordion-names">{mech.automation_functions.map((a) => a.name).join(', ')}</span>
		{/if}
		<span class="accordion-indicator">▼</span>
	</button>

	{#if autoAccOpen}
		<div class="automation-cards">
			{#each selectedMech.automation_functions as auto, i}
				<div class="automation-card">
					<h4>{auto.name}</h4>
					<p>{auto.description}</p>
					<label>
						<input type="checkbox" bind:checked={auto.active} />
						{auto.active ? 'Active' : 'Inactive'}
					</label>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.section {
		padding: 1rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
		margin-top: 0.5rem;
	}

	@media (max-width: 600px) {
		.section {
			padding: 0.3rem;
		}
	}

	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		background: #111;
		border: 2px solid #0ff;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 1.1rem;
		font-weight: bold;
		color: #0ff;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.accordion-header:hover {
		background: rgba(0, 255, 255, 0.1);
		box-shadow: 0 0 10px #0ff;
		transform: translateY(-2px);
	}

	.accordion-title {
		flex: 0 0 auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 80%;
	}

	.accordion-names {
		flex: 1;
		font-size: 0.85rem;
		color: #aaa;
		margin: 0 1rem;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 600px) {
		.accordion-names {
			display: none;
		}
	}

	.accordion-indicator {
		font-size: 1.2rem;
		color: #ff0;
		transition: transform 0.25s ease;
	}

	[aria-expanded='true'] .accordion-indicator {
		transform: rotate(180deg);
	}

	.automation-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	@media (max-width: 600px) {
		.automation-cards {
			margin: 0.3rem;
			gap: 0.3rem;
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.automation-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 0.5rem;
		border: 1px solid rgba(0, 245, 255, 0.3);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.automation-card h4 {
		margin: 0 0 0.3rem;
		color: #00f5ff;
	}

	.automation-card p {
		font-size: 0.9rem;
		margin-bottom: 0.6rem;
		color: #aaa;
	}

	.automation-card label {
		font-size: 0.9rem;
		cursor: pointer;
	}

	input[type='checkbox'] {
		accent-color: #ff0080;
		margin-right: 0.5rem;
	}
</style>
