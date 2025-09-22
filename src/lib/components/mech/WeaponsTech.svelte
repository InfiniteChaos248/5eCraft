<script>
	import CustomNumber from './CustomNumber.svelte';

	let { mech = $bindable() } = $props();
	let weaponsAccOpen = $state(false);

	function onMagEmpty(name) {
		alert('reload!!');
		mech.weapons
			.filter((w) => w.name === name)
			.forEach((w) => {
				if (w.mags === 1) {
					w.ammo = 0;
					w.mags = 0;
				} else {
					w.ammo = w.mag_capacity;
					w.mags = w.mags - 1;
				}
			});
	}

	function onMagRefill(name) {
		mech.weapons
			.filter((w) => w.name === name)
			.forEach((w) => {
				w.ammo = 1;
				w.mags = w.mags + 1;
			});
	}
</script>

<div class="section">
	<button
		class="accordion-header"
		onclick={() => (weaponsAccOpen = !weaponsAccOpen)}
		aria-expanded={weaponsAccOpen}
	>
		<span class="accordion-title">Weapons</span>
		{#if !weaponsAccOpen}
			<span class="accordion-names">{mech.weapons.map((w) => w.name).join(', ')}</span>
		{/if}
		<span class="accordion-indicator">▼</span>
	</button>

	{#if weaponsAccOpen}
		<div class="accordion-cards">
			{#each mech.weapons as weapon, i}
				<div class="accordion-card">
					<h4>{weapon.name}</h4>
					<div class="weapon-grid">
						<div class="weapon-info-container">
							<div class="weapon-info-label">SKILL</div>
							<div class="weapon-info-value">{weapon.skill}</div>
						</div>
						<div class="weapon-info-container">
							<div class="weapon-info-label">DAMAGE</div>
							<div class="weapon-info-value">{weapon.damage} X {mech.stats.size}</div>
						</div>
						<div class="weapon-info-container">
							<div class="weapon-info-label">ROF</div>
							<div class="weapon-info-value">{weapon.rof}</div>
						</div>
						<div class="weapon-info-container">
							<div class="weapon-info-label">RELOAD</div>
							<div class="weapon-info-value">{weapon.reload}</div>
						</div>
						<div class="weapon-info-container">
							<div class="weapon-info-label">AMMO</div>
							<div class="weapon-info-value">
								<CustomNumber
									min={0}
									max={weapon.mag_capacity}
									bind:value={weapon.ammo}
									weapon={weapon.name}
									{onMagEmpty}
									{onMagRefill}
								/>
							</div>
						</div>
						<div class="weapon-info-container">
							<div class="weapon-info-label">MAGS</div>
							<div class="weapon-info-value">
								<CustomNumber min={0} max={100} bind:value={weapon.mags} />
							</div>
						</div>
					</div>
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
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1rem;
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
	}

	.accordion-card h4 {
		margin: 0 0 0.5rem;
		color: #00f5ff;
	}

	.weapon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
		gap: 0.2rem 0.5rem;
	}

	.weapon-info-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;

		background: rgba(0, 245, 255, 0.05);
		border: 1px solid rgba(0, 245, 255, 0.3);
		border-radius: 6px;
		padding: 0.4rem 0.6rem;
	}

	.weapon-info-label {
		font-weight: bold;
		color: #fffb00;
		text-shadow: 0 0 4px #fffb00;
		font-size: 0.9rem;
	}

	.weapon-info-value {
		font-size: 0.9rem;
	}
</style>
