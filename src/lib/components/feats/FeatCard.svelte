<script>
	let { feat, closeFeatCard, showIcons = false } = $props();
</script>

<div class="feat-card">
	{#if showIcons}
		<div class="feat-actions">
			<button class="icon-button" onclick={() => closeFeatCard(feat.slug)} title="Close">
				❌
			</button>
			<a
				class="icon-button"
				href={`/feats/${feat.slug}`}
				target="_blank"
				rel="noopener noreferrer"
				title="Open in new tab"
			>
				↗️
			</a>
		</div>
	{/if}
	<div class="feat-header">
		<h2>{feat.name}</h2>
		<span class="feat-meta">
			<div>Source: {feat.source}</div>
			{#if feat.prerequisite}
				<div>Prerequisite: {feat.prerequisite}</div>
			{/if}
		</span>
	</div>

	<div class="feat-description">
		{@html feat.description}
	</div>
</div>

<style>
	.feat-card {
		position: relative;
		background: #fdf8e4;
		border: 2px solid #6d4c41;
		border-radius: 12px;
		padding: 1.5rem;
		margin: 1rem 0;
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
		font-family: 'Georgia', serif;
		max-width: 640px;
		margin-inline: auto;
		transition: transform 0.2s;
	}

	.feat-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 1rem;
	}

	.feat-header h2 {
		font-size: 1.75rem;
		margin: 0;
		color: #4e342e;
	}

	.feat-meta {
		font-size: 1rem;
		color: #5d4037;
		font-style: italic;
	}

	.feat-description {
		margin-top: 1rem;
		font-size: 1rem;
		line-height: 1.6;
		color: #3e2723;
	}

	:global(.feat-description p) {
		margin: 0.5rem 0;
	}

	:global(.feat-description ul) {
		list-style-type: circle;
		padding-left: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.feat-description ul li) {
		margin-bottom: 0.25rem;
		font-size: 1rem;
		line-height: 1.5;
	}

	:global(.feat-description table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		background-color: #fff8dc; /* Light parchment */
		color: #3e2723; /* Dark brown */
		border: 1px solid #a1887f;
		font-size: 0.95rem;
	}

	:global(.feat-description tbody) {
		background-color: #f5e5b8;
	}

	:global(.feat-description th) {
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: #4e342e;
		border-bottom: 1px solid #a1887f;
		text-align: left;
	}

	:global(.feat-description tr:nth-child(even)) {
		background-color: #f9f3dc;
	}

	:global(.feat-description td) {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #d7ccc8;
	}

	.feat-actions {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.icon-button {
		background: #fff8e1;
		border: 1px solid #6d4c41;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		transition:
			background 0.2s,
			transform 0.2s;
		text-decoration: none;
	}

	.icon-button:hover {
		background: #ffe0b2;
		transform: scale(1.05);
	}

	@media (max-width: 600px) {
		.feat-card {
			padding: 1rem;
			font-size: 0.9rem;
		}

		.feat-header h2 {
			font-size: 1.3rem;
		}

		.feat-meta {
			font-size: 0.9rem;
		}

		.feat-description {
			font-size: 0.9rem;
			line-height: 1.5;
		}

		:global(.feat-description ul li) {
			font-size: 0.9rem;
		}

		:global(.feat-description .table-wrapper) {
			overflow-x: auto;
			width: 100%;
		}

		:global(.feat-description table) {
			width: 100%;
			min-width: 100%;
			table-layout: auto;
			font-size: 0.9rem;
		}

		:global(.feat-description th),
		:global(.feat-description td) {
			padding: 0.5rem 0.75rem;
			white-space: nowrap;
		}

		.icon-button {
			width: 28px;
			height: 28px;
			font-size: 0.9rem;
		}
	}
</style>
