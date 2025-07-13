<script>
	const { name, content = 'Content' } = $props();
</script>

<div class="not-found-wrapper">
	<div class="not-found-box">
		<h1>{content} Not Found</h1>
		<p>{name}</p>
	</div>
</div>

<style>
	.not-found-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
		color: #e5e7eb;
		font-family: 'Segoe UI', sans-serif;
		padding: 2rem;
		text-align: center;
	}

	.not-found-box {
		background-color: #1f2937;
		border: 2px solid #374151;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
		max-width: 500px;
	}

	.not-found-box h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: #f87171; /* Soft red for emphasis */
	}

	.not-found-box p {
		font-size: 1rem;
		color: #d1d5db;
	}
</style>
