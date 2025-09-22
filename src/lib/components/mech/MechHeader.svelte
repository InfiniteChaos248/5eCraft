<script>
	let { mech } = $props();
</script>

<div class="mech-header">
	<h2 class="mech-name">{mech.name}</h2>
	<p class="pilot">Pilot: {mech.pilot}</p>
</div>

<style>
	.mech-header {
		text-align: center;
	}

	.mech-name {
		font-size: 2rem;
		color: #00f5ff;
		margin-bottom: 0.3rem;
		text-shadow: 0 0 8px #00f5ff;
	}

	.pilot {
		font-size: 1rem;
		color: #aaa;
	}
</style>
