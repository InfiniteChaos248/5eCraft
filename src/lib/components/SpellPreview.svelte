<script>
	const { spell, onSpellPreviewClick } = $props();
</script>

<!-- href={`/spells/${spell.slug}`} -->

<div
	class="spell-preview"
	onclick={onSpellPreviewClick}
	role="button"
	tabindex="0"
	onkeydown={(event) => {
		if (event.key === 'Enter') {
			onSpellPreviewClick();
		}
	}}
>
	<div class="spell-name">{spell.name}</div>
	<div class="spell-meta">
		<span class="level-school"
			>{#if spell.level === '0'}
				{spell.school} Cantrip
			{:else}
				Level {spell.level} {spell.school} Spell
			{/if}</span
		>
		<span class="other-info">{spell.casting_time} | {spell.range}</span>
	</div>
</div>

<style>
	.spell-preview {
		background: #f5f0e1;
		border: 1px solid #d7ccc8;
		border-left: 5px solid #6d4c41;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition: background 0.2s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

		display: flex;
		flex-direction: column;
		justify-content: space-around;
		min-height: 5rem;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spell-preview:hover {
		background: #ede6d6;
		transform: translateX(2px);
	}

	.spell-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: #4e342e;
	}

	.spell-meta {
		font-size: 0.9rem;
		color: #5d4037;
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.level-school {
		font-style: italic;
	}

	.other-info {
		font-size: 0.85rem;
		color: #6d4c41;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
