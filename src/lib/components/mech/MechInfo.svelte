<script>
	import CustomNumber from './NumberControl1.svelte';

	let { mech = $bindable() } = $props();
</script>

<div class="mech-info">
	<h2 class="mech-info-title">INFO</h2>
	<div class="mech-info-grid">
		<div class="info-card">
			<span class="info-label">Lift Capacity</span>
			<span class="info-value">{mech.derived_info.lift_capacity}</span>
		</div>
		<div class="info-card">
			<span class="info-label">HP (max. <strong>{mech.derived_info.max_hp}</strong>)</span>
			<span class="info-value">
				<CustomNumber min={0} max={mech.derived_info.max_hp} bind:value={mech.info.hp} />
			</span>
		</div>
		<div class="info-card">
			<span class="info-label">Size</span>
			<span class="info-value">{mech.info.size}</span>
		</div>
		<div class="info-card">
			<span class="info-label">Speed</span>
			<span class="info-value">{mech.derived_info.speed}</span>
		</div>
		<div class="info-card">
			<span class="info-label"
				>Inv. (max. <strong>{mech.derived_info.inventory_capacity}</strong>)</span
			>
			<span class="info-value">
				<CustomNumber
					min={0}
					max={parseInt(mech.derived_info.inventory_capacity.match(/\d+/))}
					bind:value={mech.info.inv}
				/>
			</span>
		</div>
	</div>
</div>

<style>
	.mech-info {
		margin-top: 0.5rem;
		padding: 1rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
	}

	.mech-info-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.2rem;
		color: #00ffcc;
		margin: 0;
		margin-bottom: 1rem;
		text-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
	}

	.mech-info-grid {
		display: grid;
		gap: 0.8rem 0.8rem;
		grid-template-columns: repeat(5, 1fr);
	}

	@media (max-width: 1100px) {
		.mech-info-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.mech-info-grid {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.info-card {
		background: #222;
		border: 1px solid #333;
		padding: 0.75rem;
		border-radius: 8px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.info-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 0 8px rgba(0, 255, 204, 0.3);
	}

	.info-label {
		display: block;
		font-size: 0.8rem;
		color: #aaa;
		text-transform: uppercase;
		margin-bottom: 0.25rem;
	}

	.info-value {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.2rem;
		color: #fff;
	}
</style>
