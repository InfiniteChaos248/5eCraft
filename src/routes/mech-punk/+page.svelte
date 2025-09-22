<script>
	import AutomationFunctions from '$lib/components/mech/AutomationFunctions.svelte';
	import Battery from '$lib/components/mech/Battery.svelte';
	import MechHeader from '$lib/components/mech/MechHeader.svelte';
	import MechInfo from '$lib/components/mech/MechInfo.svelte';
	import MechStats from '$lib/components/mech/MechStats.svelte';
	import SpecialTech from '$lib/components/mech/SpecialTech.svelte';
	import WeaponsTech from '$lib/components/mech/WeaponsTech.svelte';
	import { getAllMechs, getmechData } from '$lib/utils/dataUtils';

	let mechs = $state(getAllMechs());
	let mechData = $state(getmechData());
	let selectedMech = $state(mechs[0]);

	function compute_mech_sheet(mech) {
		mech.automation_functions.forEach((auto) => {
			if ('stat_booster' in auto) {
				let booster = auto.stat_booster;
				if (auto.active) {
					mech.stats[booster.stat] = mech.stats[booster.stat] + booster.value;
				}
			}
		});
		mech.info.lift_capacity = mechData.lift_capacity[mech.stats.strength];
		mech.info.inventory_capacity = mechData.inventory_capacity[mech.stats.strength];
		mech.info.max_hp = mech.stats.strength * mech.stats.size * mech.stats.style_integrity * 10;
		mech.info.speed = String(mech.stats.speed * 10) + ' m/s';
		return mech;
	}

	let mech = $state(null);
	$effect(() => {
		mech = compute_mech_sheet(JSON.parse(JSON.stringify(selectedMech)));
	});
</script>

<div class="mechpunk-wrapper">
	<label for="mech-select">Choose your Mech:</label>
	<select id="mech-select" bind:value={selectedMech}>
		<option value="" disabled selected>Select a mech</option>
		{#each mechs as mech}
			<option value={mech}>{mech.name}</option>
		{/each}
	</select>

	{#if mech}
		<div class="mech-container">
			<MechHeader {mech} />

			<div class="mech-content-grid">
				<MechStats {mech} />

				<MechInfo bind:mech />

				<AutomationFunctions {mech} bind:selectedMech />

				<WeaponsTech bind:mech />

				<SpecialTech {mech} />

				<Battery bind:mech />
				<div>Mech Integrity</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

	.mechpunk-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Orbitron', sans-serif;
		color: #e0faff;
	}

	.mech-container {
		background: #0d0d0d;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		padding: 1rem;
		margin: 1rem 0;
		box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
	}

	.mech-content-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
