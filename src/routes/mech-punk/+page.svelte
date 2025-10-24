<script>
	import AutomationFunctions from '$lib/components/mech/AutomationFunctions.svelte';
	import Battery from '$lib/components/mech/Battery.svelte';
	import Integrity from '$lib/components/mech/Integrity.svelte';
	import MechHeader from '$lib/components/mech/MechHeader.svelte';
	import MechInfo from '$lib/components/mech/MechInfo.svelte';
	import MechStats from '$lib/components/mech/MechStats.svelte';
	import SpecialTech from '$lib/components/mech/SpecialTech.svelte';
	import WeaponsTech from '$lib/components/mech/WeaponsTech.svelte';
	import { getmechData } from '$lib/utils/dataUtils';
	import { load } from '../feats/[slug]/+page';

	let code = $state(null);
	let error = $state('');
	let loading = $state('');
	let message = $state('');

	let selectedMech = $state(null);
	let accessCode = $state('');
	let readOnly = $state(false);

	async function fetchMech() {
		if (!code) return;
		error = '';
		loading = 'Fetching Mech ...';
		try {
			const res = await fetch(`/api/mech-punk/get?code=${encodeURIComponent(code)}`);
			if (!res.ok) {
				const errorText = await res.text();
				throw new Error('Failed to fetch mech :: ' + errorText);
			}
			const response_data = await res.json();
			readOnly = response_data.read_only;
			accessCode = response_data.code;
			selectedMech = JSON.parse(response_data.mech_data);
			mech = compute_mech_sheet(JSON.parse(response_data.mech_data));
		} catch (err) {
			error = err.message;
		} finally {
			setTimeout(() => {
				error = '';
			}, 5000);
			loading = '';
			code = '';
		}
	}

	let mechData = $state(getmechData());

	function compute_mech_sheet(mech) {
		mech.stats = JSON.parse(JSON.stringify(mech.raw_stats));
		mech.automation_functions.forEach((auto) => {
			if ('stat_booster' in auto) {
				let booster = auto.stat_booster;
				if (auto.active) {
					mech.stats[booster.stat] = mech.stats[booster.stat] + booster.value;
				}
			}
		});
		mech.derived_info = {};
		mech.derived_info.lift_capacity = mechData.lift_capacity[mech.stats.strength];
		mech.derived_info.inventory_capacity = mechData.inventory_capacity[mech.stats.strength];
		mech.derived_info.max_hp =
			mech.stats.strength * mech.stats.size * mech.stats.style_integrity * 10;
		mech.derived_info.speed = String(mech.stats.speed * 10) + ' m/s';
		return mech;
	}

	let mech = $state(null);
	$effect(() => {
		if (selectedMech) mech = compute_mech_sheet(JSON.parse(JSON.stringify(selectedMech)));
	});

	function closeMech() {
		if (confirm('Are you sure you want to close?')) {
			mech = null;
			selectedMech = null;
			code = '';
			accessCode = '';
			readOnly = false;
		}
	}

	function syncMech() {
		if (readOnly || !accessCode) return;

		error = '';
		loading = 'Syncing Mech ...';

		let request_body = {};
		request_body.code = accessCode;
		let mech_copy = JSON.parse(JSON.stringify(mech));
		delete mech_copy.stats;
		delete mech_copy.derived_info;
		request_body.mech_data = JSON.parse(JSON.stringify(mech_copy));

		fetch('/api/mech-punk/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request_body)
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(res.text());
				}
				message = 'Sync Completed.';
				setTimeout(() => {
					message = '';
				}, 5000);
			})
			.catch((error) => {
				error = error.message;
			})
			.finally(() => {
				setTimeout(() => {
					error = '';
				}, 5000);
				loading = '';
				code = '';
			});
	}
</script>

<div class="mechpunk-wrapper">
	{#if !mech}
		<div class="mech-access">
			<div class="access-bar">
				<input class="code-input" type="text" bind:value={code} placeholder="Access code" />
				<button class="code-button" onclick={fetchMech} disabled={!code}> Submit </button>
			</div>
		</div>
	{/if}

	{#if loading || error || message}
		<div class="status-area">
			{#if loading}
				<p class="status-text loading">{loading}</p>
			{/if}

			{#if message}
				<p class="status-text message">{message}</p>
			{/if}

			{#if error}
				<p class="status-text error">{error}</p>
			{/if}
		</div>
	{/if}

	{#if mech}
		<div class="mech-container">
			<MechHeader {mech} {closeMech} {syncMech} {readOnly} />

			<div class="mech-content-grid">
				<MechStats {mech} />

				<MechInfo bind:mech />

				<AutomationFunctions bind:selectedMech />

				<WeaponsTech bind:mech />

				<SpecialTech {mech} />

				<Battery bind:mech {mechData} />

				<Integrity bind:mech {mechData} />
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

	@media (max-width: 768px) {
		.mechpunk-wrapper {
			padding: 1rem;
		}
	}

	@media (max-width: 480px) {
		.mechpunk-wrapper {
			padding: 0.2rem;
		}
	}

	.mech-access {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 2rem auto;
		padding: 1rem;
		max-width: 400px;
		color: #e0faff;
		font-family: 'Orbitron', sans-serif;
	}

	.access-bar {
		display: flex;
		flex-direction: row;
		gap: 0.8rem;
		width: 100%;
		justify-content: center;
	}

	.code-input,
	.code-button {
		padding: 0.6rem 1rem;
		border-radius: 6px;
		border: 2px solid #00f5ff;
		background: #111;
		color: #e0faff;
		font-family: inherit;
		cursor: pointer;
		flex: 1;
		max-width: 180px;
		text-align: center;
	}

	.code-button {
		flex: 0;
	}

	.code-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.status-area {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1.5rem;
	}

	.status-text {
		font-size: 0.9rem;
		margin: 0;
	}

	.status-text.loading {
		color: green;
		animation: pulse 1.5s infinite;
	}

	.status-text.message {
		color: black;
		animation: pulse 1.5s infinite;
	}

	.status-text.error {
		color: #ff4d4d;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
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
