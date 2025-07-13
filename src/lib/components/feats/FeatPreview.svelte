<script>
	const { feat, onFeatPreviewClick } = $props();
</script>

<div
	class="feat-preview"
	onclick={onFeatPreviewClick}
	role="button"
	tabindex="0"
	onkeydown={(event) => {
		if (event.key === 'Enter') {
			onFeatPreviewClick();
		}
	}}
>
	<div class="feat-name">{feat.name}</div>
	<div class="feat-meta">
		<span class="feat-source">
			source: {feat.source}
		</span>
	</div>
</div>

<style>
	.feat-preview {
		background: #f5f0e1;
		border: 1px solid #d7ccc8;
		border-left: 5px solid #6d4c41;
		border-radius: 8px;
		padding: 5px;
		cursor: pointer;
		transition: background 0.2s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

		display: flex;
		flex-direction: column;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.feat-preview:hover {
		background: #ede6d6;
		transform: translateX(2px);
	}

	.feat-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: #4e342e;
	}

	.feat-meta {
		font-size: 0.7rem;
		color: #5d4037;
		margin-top: 0.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.feat-source {
		font-style: italic;
	}
</style>
