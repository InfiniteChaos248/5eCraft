<script>
	let { mech } = $props();
</script>

<div class="section">
	<h3 class="section-title">STATS</h3>
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-name">SIZE</span><span class="stat-value">{mech.stats.size}</span>
		</div>
		<div class="stat-card">
			<span class="stat-name">SPEED</span><span class="stat-value">{mech.stats.speed}</span>
		</div>
		<div class="stat-card">
			<span class="stat-name">STRENGTH</span><span class="stat-value">{mech.stats.strength}</span>
		</div>
		<div class="stat-card">
			<span class="stat-name">WPN TECH</span><span class="stat-value"
				>{mech.stats.weapons_tech}</span
			>
		</div>
		<div class="stat-card">
			<span class="stat-name">SPL TECH</span><span class="stat-value"
				>{mech.stats.special_tech}</span
			>
		</div>
		<div class="stat-card">
			<span class="stat-name">STYLE | INT</span><span class="stat-value"
				>{mech.stats.style_integrity}</span
			>
		</div>
	</div>
</div>

<style>
	.section {
		padding: 1rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
	}

	.section-title {
		font-size: 1.2rem;
		margin: 0;
		margin-bottom: 1rem;
		color: #ff0080;
		text-shadow: 0 0 6px #ff0080;
	}

	/* .stats-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
} */

	.stats-grid {
		display: grid;
		gap: 0.8rem 0.8rem;
		grid-template-columns: repeat(6, 1fr);
	}

	@media (max-width: 1100px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.stat-name {
		font-size: 1rem;
		font-weight: bold;
		color: #fffb00;
		text-shadow: 0 0 5px #fffb00;
	}

	.stat-value {
		font-size: 1rem;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 0.6rem 0.8rem;
		border-radius: 6px;
		border: 1px solid rgba(0, 245, 255, 0.3);
		display: flex;
		justify-content: space-between;
	}
</style>
