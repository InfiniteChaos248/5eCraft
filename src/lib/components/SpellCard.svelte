<script>
	let { spell, closeSpellCard, showIcons = false } = $props();
</script>

<div class="spell-card">
	{#if showIcons}
		<div class="spell-actions">
			<button class="icon-button" onclick={() => closeSpellCard(spell.slug)} title="Close">
				❌
			</button>
			<a
				class="icon-button"
				href={`/spells/${spell.slug}`}
				target="_blank"
				rel="noopener noreferrer"
				title="Open in new tab"
			>
				↗️
			</a>
		</div>
	{/if}
	<div class="spell-header">
		<h2>{spell.name}</h2>
		<span class="spell-meta">
			{#if spell.level === '0'}
				{spell.school} Cantrip
			{:else}
				Level {spell.level} {spell.school} Spell
			{/if}
		</span>
	</div>

	<div class="spell-details">
		<p><strong>Casting Time:</strong> {spell.casting_time}</p>
		<p><strong>Range:</strong> {spell.range}</p>
		<p><strong>Components:</strong> {spell.components}</p>
		<p><strong>Duration:</strong> {spell.duration}</p>
	</div>

	<div class="spell-description">
		<p>{@html spell.description}</p>
		{#if spell.at_higher_levels}
			<p><strong>At Higher Levels:</strong> {spell.at_higher_levels}</p>
		{/if}
	</div>

	<div class="spell-minor-details">
		<p><strong>Classes:</strong> {spell.classes}</p>
		<p><strong>Source:</strong> {spell.sources}</p>
	</div>
</div>

<style>
	.spell-card {
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

	.spell-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 1rem;
	}

	.spell-header h2 {
		font-size: 1.75rem;
		margin: 0;
		color: #4e342e;
	}

	.spell-meta {
		font-size: 1rem;
		color: #5d4037;
		font-style: italic;
	}

	.spell-details p {
		margin: 0.3rem 0;
		font-size: 0.95rem;
	}

	.spell-minor-details p {
		margin: 0.3rem 0;
		font-size: 0.75rem;
	}

	.spell-description {
		margin-top: 1rem;
		font-size: 1rem;
		line-height: 1.6;
		color: #3e2723;
	}

	.spell-description p {
		margin: 0.5rem 0;
	}

	.spell-actions {
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
</style>
