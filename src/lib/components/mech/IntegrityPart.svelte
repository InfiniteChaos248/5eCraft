<script>
	let { part, selected_part, selectPart } = $props();
</script>

<div
	class="part-container"
	onclick={() => selectPart(part.id)}
	role="button"
	tabindex="0"
	onkeydown={(event) => {
		if (event.key === 'Enter') {
			selectPart(part.id);
		}
	}}
	class:selected={selected_part === part}
	class:damaged={!part.disconnected && part.current_integrity === -1}
	class:disconnected={part.disconnected}
>
	<span class="part-label">{part.label}</span>
	<div class="integrity-bar">
		{#each Array(part.max_integrity) as _, j}
			<div class="integrity-dot" class:filled={j < part.current_integrity}></div>
		{/each}
	</div>
</div>

<style>
	.part-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(25, 25, 35, 0.8);
		border: 1px solid rgba(57, 255, 20, 0.25);
		border-radius: 0.5rem;
		padding: 0.4rem 0.6rem;
		transition:
			background 0.2s ease,
			transform 0.1s ease,
			border-color 0.2s ease;
		cursor: pointer;
		max-width: 160px;
	}
	@media (max-width: 400px) {
		.part-container {
			font-size: 0.9rem;
		}
	}
	.part-container.selected {
		box-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
	}
	.part-container.damaged {
		border-color: #ff4d4d;
		background: rgba(60, 0, 0, 0.3);
	}
	.part-container.disconnected {
		border-color: #00aaff;
		background: rgba(0, 40, 60, 0.3);
	}

	.integrity-bar {
		display: flex;
		gap: 0.5rem;
	}

	.integrity-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid var(--accent, #39ff14);
		background: rgba(0, 0, 0, 0.2);
	}
	.integrity-dot.filled {
		background: var(--accent, #39ff14);
		box-shadow: 0 0 6px var(--accent, #39ff14);
	}
</style>
