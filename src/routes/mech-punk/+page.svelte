<script>
	import AutomationFunctions from '$lib/components/mech/AutomationFunctions.svelte';
	import Battery from '$lib/components/mech/Battery.svelte';
	import MechHeader from '$lib/components/mech/MechHeader.svelte';
	import MechInfo from '$lib/components/mech/MechInfo.svelte';
	import MechStats from '$lib/components/mech/MechStats.svelte';
	import SpecialTech from '$lib/components/mech/SpecialTech.svelte';
	import WeaponsTech from '$lib/components/mech/WeaponsTech.svelte';
	import { getAllMechs, getmechData } from '$lib/utils/dataUtils';

	let code = $state(null);
	let mechList = $state([]);
	let mechName = $state('');
	let loadingMech = $state(false);
	let error = $state('');

	async function fetchMechList() {
		if (!code) return;
		error = '';
		try {
			const res = await fetch(`/api/mech-punk/list?code=${encodeURIComponent(code)}`);
			if (!res.ok) throw new Error('Failed to fetch mech list');
			mechList = await res.json();
			if (!mechList.length) {
				alert('Invalid Access Code');
				code = '';
			}
		} catch (err) {
			alert('Error :: ' + err.message);
		}
	}

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
	<div class="mech-access">
		{#if !mechList.length}
			<input class="code-input" type="text" bind:value={code} placeholder="Access code" />
			<button class="code-button" onclick={fetchMechList} disabled={!code}> Submit </button>
		{/if}

		{#if mechList.length}
			<div class="mech-select">
				<select class="mech-dropdown" bind:value={mechName}>
					<option value="" disabled selected>Select Mech</option>
					{#each mechList as mech}
						<option value={mech}>{mech}</option>
					{/each}
				</select>
				<button onclick={fetchMechData} disabled={loadingMech || !mechName}>
					{loadingMech ? 'Loading...' : 'Go!'}
				</button>
			</div>
		{/if}

		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>

	{#if mech}
		<div class="mech-container">
			<MechHeader {mech} />

			<div class="mech-content-grid">
				<MechStats {mech} />

				<MechInfo bind:mech />

				<AutomationFunctions {mech} bind:selectedMech />

				<WeaponsTech bind:mech />

				<SpecialTech {mech} />

				<Battery bind:mech {mechData} />
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

	.mech-access {
		max-width: 400px;
		margin: 2rem auto;
		display: flex;
		flex-direction: row;
		gap: 0.8rem;
		font-family: 'Orbitron', sans-serif;
		color: black;
	}

	.code-input,
	.code-button,
	.mech-dropdown {
		padding: 0.5rem 0.8rem;
		border-radius: 6px;
		border: 2px solid #00f5ff;
		background: #111;
		color: #e0faff;
		font-family: 'Orbitron', sans-serif;
	}

	button:disabled {
		display: none;
	}

	.mech-select {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
