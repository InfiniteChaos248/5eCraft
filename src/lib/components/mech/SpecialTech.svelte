<script>
	let { mech } = $props();
	let specialTechAccOpen = $state(false);
</script>

<div class="section">
	<button
		class="accordion-header"
		onclick={() => (specialTechAccOpen = !specialTechAccOpen)}
		aria-expanded={specialTechAccOpen}
	>
		<span class="accordion-title">Special Tech</span>
		{#if !specialTechAccOpen}
			<span class="accordion-names">{mech.special_tech.map((s) => s.name).join(', ')}</span>
		{/if}

		<span class="accordion-indicator">▼</span>
	</button>

	{#if specialTechAccOpen}
		<div class="accordion-cards">
			{#each mech.special_tech as tech, i}
				<div class="accordion-card">
					<h4>{tech.name}</h4>
					<div><span>Type:</span> {tech.type}</div>
					<div><span>Function:</span> {tech.function}</div>
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

	.accordion-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1rem;
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 600px) {
		.accordion-cards {
			margin: 0.3rem;
			gap: 0.3rem;
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.accordion-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border: 1px solid rgba(0, 245, 255, 0.3);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.accordion-card h4 {
		margin: 0 0 0.5rem;
		color: #00f5ff;
	}

	.accordion-card span {
		font-weight: bold;
		color: #fffb00;
		text-shadow: 0 0 4px #fffb00;
	}
</style>
