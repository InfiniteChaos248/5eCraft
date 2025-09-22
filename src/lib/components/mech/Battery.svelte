<script>
	import CustomNumber from './CustomNumber.svelte';

	let { mech = $bindable() } = $props();

	let charge_perc = $state(0);

	let selected_core = $state(-1);
	function select_core(chg_core_id) {
		if (selected_core === chg_core_id) {
			selected_core = -1;
		} else {
			selected_core = chg_core_id;
		}
	}

	let mode = $state('passive');

	function set_charge_status(chg, status, perc = chg.percentage) {
		chg.status = status;
		chg.percentage = perc;
	}

	function discharge_charge_unit(chg) {
		let available = chg.percentage;

		if (charge_perc <= available) {
			set_charge_status(
				chg,
				chg.percentage - charge_perc === 0 ? 'empty' : chg.status,
				chg.percentage - charge_perc
			);
			charge_perc = 0;
		} else {
			set_charge_status(chg, 'empty', 0);
			charge_perc -= available;
		}
	}

	function discharge_battery() {
		['active', 'ready'].forEach((status) => {
			mech.battery.chg_units.filter((chg) => chg.status === status).forEach(discharge_charge_unit);
		});
	}

	function recharge_charge_unit(chg) {
		let required = 100 - chg.percentage;

		if (charge_perc >= required) {
			let newPerc = chg.percentage + required;
			let newStatus = chg.status === 'empty' && newPerc === 100 ? 'ready' : chg.status;
			set_charge_status(chg, newStatus, newPerc);
			charge_perc -= required;
		} else {
			set_charge_status(chg, chg.status, chg.percentage + charge_perc);
			charge_perc = 0;
		}
	}

	function recharge_battery() {
		['active', 'empty', 'ready'].forEach((status) => {
			mech.battery.chg_units.filter((chg) => chg.status === status).forEach(recharge_charge_unit);
		});
	}

	function swap_charge_unit() {
		let current = mech.battery.chg_units.find((c) => c.status === 'active');
		let target = mech.battery.chg_units.find((c) => c.id === selected_core);

		if (!target) return;

		if (target.status === 'destroyed') return alert("Can't swap to a destroyed charge unit");
		if (target.status === 'active') return alert('Charge unit already in use');
		if (target.status === 'empty') return alert("Can't swap to an empty charge unit");

		if (current) {
			set_charge_status(current, current.percentage === 0 ? 'empty' : 'ready');
		}

		set_charge_status(target, 'active');

		selected_core = -1;
	}

	function destroy_charge_unit() {
		let chg = mech.battery.chg_units.find((c) => c.id === selected_core);
		if (chg) {
			set_charge_status(chg, 'destroyed', 0);
		}
		selected_core = -1;
	}

	function repair_charge_unit() {
		let chg = mech.battery.chg_units.find((c) => c.id === selected_core);
		if (chg && chg.status === 'destroyed') {
			set_charge_status(chg, 'empty', 0);
		}
		selected_core = -1;
	}
</script>

<div class="battery-section">
	<h3 class="section-title">Battery | {mech.battery.core_type} Core</h3>

	<div class="core-grid">
		{#each mech.battery.chg_units as chg}
			<div
				class="core"
				class:active={chg.status === 'active'}
				class:ready={chg.status === 'ready'}
				class:destroyed={chg.status === 'destroyed'}
				class:selected={chg.id === selected_core}
				role="button"
				tabindex="0"
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						select_core(chg.id);
					}
				}}
				onclick={() => {
					select_core(chg.id);
				}}
			>
				{chg.status === 'destroyed' ? '✖' : chg.percentage}
			</div>
		{/each}
	</div>

	<div class="battery-actions">
		<button class="battery-btn discharge" onclick={discharge_battery}>Discharge</button>
		<div class="charge-control">
			<button
				class="small-btn double-left"
				onclick={() => {
					charge_perc = Math.max(0, charge_perc - 100);
				}}>&laquo;</button
			>
			<button
				class="small-btn left"
				onclick={() => {
					charge_perc = Math.max(0, charge_perc - 1);
				}}>&lsaquo;</button
			>
			<input type="number" class="charge-input" bind:value={charge_perc} />
			<button
				class="small-btn right"
				onclick={() => {
					charge_perc = Math.min(mech.battery.charge_units * 100, charge_perc + 1);
				}}>&rsaquo;</button
			>
			<button
				class="small-btn double-right"
				onclick={() => {
					charge_perc = Math.min(mech.battery.charge_units * 100, charge_perc + 100);
				}}>&raquo;</button
			>
		</div>
		<button class="battery-btn recharge" onclick={recharge_battery}>Recharge</button>
		<button class="battery-btn repair" onclick={swap_charge_unit}>Swap</button>
		<button class="battery-btn destroy" onclick={destroy_charge_unit}>Destroy</button>
		<button class="battery-btn repair" onclick={repair_charge_unit}>Repair</button>
	</div>

	<!-- Mode Toggle -->
	<div class="mode-toggle">
		<label>
			<input type="radio" bind:group={mode} value="passive" /> Passive
		</label>
		<label>
			<input type="radio" bind:group={mode} value="active" /> Active
		</label>
		<label>
			<input type="radio" bind:group={mode} value="combat" /> Combat
		</label>
	</div>

	<!-- Consumption Table -->
	<div class="consumption-tables">
		<h4>Energy Consumption</h4>
		<table class="consumption-table">
			<thead>
				<tr>
					<th>Mode</th>
					<th>Per Minute</th>
					<th>Per Round</th>
				</tr>
			</thead>
			<tbody>
				<tr class:highlight={mode === 'passive'}>
					<td>Passive</td>
					<td>1</td>
					<td>-</td>
				</tr>
				<tr class:highlight={mode === 'active'}>
					<td>Active</td>
					<td>3</td>
					<td>-</td>
				</tr>
				<tr class:highlight={mode === 'combat'}>
					<td>Combat</td>
					<td>5</td>
					<td>2</td>
				</tr>
			</tbody>
		</table>

		<h4>Flight Consumption</h4>
		<table class="consumption-table">
			<thead>
				<tr>
					<th>Condition</th>
					<th>Charge / Minute</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Hover</td>
					<td>4</td>
				</tr>
				<tr>
					<td>Travel</td>
					<td>6</td>
				</tr>
				<tr>
					<td>Combat Flight</td>
					<td>10</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	.battery-section {
		padding: 1.5rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
		margin-top: 1.5rem;
	}

	.section-title {
		font-size: 1.4rem;
		color: #ff0080;
		text-shadow: 0 0 6px #ff0080;
		margin: 0;
		margin-bottom: 1rem;
	}

	.core-grid {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 0.8rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.core {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid #ccc;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		transition: all 0.2s ease;
		color: black;
	}

	.core.active {
		background: #ff0;
		box-shadow: 0 0 12px #ff0;
	}

	.core.ready {
		background: #0ff;
		box-shadow: 0 0 12px #0ff;
	}

	.core.destroyed {
		background: #222;
		border: 2px solid #f00;
		color: #f00;
		text-shadow: 0 0 6px #f00;
	}

	.core.selected {
		transform: translateY(-3px) scale(1.1);
		box-shadow:
			0 0 16px #fffb00,
			0 0 32px rgba(255, 251, 0, 0.5);
		border-color: #fffb00;
	}

	.mode-toggle {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.mode-toggle label {
		cursor: pointer;
		color: #e0faff;
	}

	.mode-toggle input[type='radio'] {
		accent-color: #ff0080;
		margin-right: 0.5rem;
	}

	.consumption-tables {
		margin-top: 1rem;
	}

	.consumption-table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	.consumption-table th,
	.consumption-table td {
		border: 1px solid rgba(0, 245, 255, 0.3);
		padding: 0.5rem 0.8rem;
		text-align: center;
	}

	.consumption-table th {
		background: rgba(0, 245, 255, 0.2);
		color: #00f5ff;
		text-shadow: 0 0 4px #00f5ff;
	}

	.consumption-table td {
		color: #e0faff;
	}

	.consumption-table tr.highlight td {
		background: rgba(255, 0, 128, 0.2);
		color: #ff0080;
		font-weight: bold;
	}

	.battery-actions {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
	}

	.battery-btn {
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		font-weight: bold;
		border: 2px solid transparent;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.25s ease-in-out;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
	}

	.battery-btn:hover {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
	}

	.battery-btn:active {
		transform: scale(0.95);
	}

	/* Theme Variants */
	.destroy {
		border-color: #ff0080;
		color: #ff0080;
		text-shadow: 0 0 6px #ff0080;
	}

	.destroy:hover {
		background: rgba(255, 0, 128, 0.15);
		box-shadow: 0 0 10px #ff0080;
	}

	.recharge {
		border-color: #fffb00;
		color: #fffb00;
		text-shadow: 0 0 6px #fffb00;
	}

	.recharge:hover {
		background: rgba(255, 251, 0, 0.15);
		box-shadow: 0 0 10px #fffb00;
	}

	.repair {
		border-color: #fffb00;
		color: #fffb00;
		text-shadow: 0 0 6px #fffb00;
	}

	.repair:hover {
		background: rgba(255, 251, 0, 0.15);
		box-shadow: 0 0 10px #fffb00;
	}

	.discharge {
		border-color: #00f5ff;
		color: #00f5ff;
		text-shadow: 0 0 6px #00f5ff;
	}

	.discharge:hover {
		background: rgba(0, 245, 255, 0.15);
		box-shadow: 0 0 10px #00f5ff;
	}

	/* Charge Control */
	.charge-control {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.charge-input {
		width: 80px;
		text-align: center;
		font-size: 1rem;
		padding: 0.4rem;
		border: 2px solid #888;
		border-radius: 6px;
		background: #111;
		color: #fff;
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8);
	}

	.small-btn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid #888;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		cursor: pointer;
		transition: all 0.25s ease-in-out;
		font-size: 0.9rem;
		line-height: 1;
	}

	.small-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 6px #fffb00;
	}

	.small-btn:active {
		transform: scale(0.9);
	}

	/* Chrome, Safari, Edge */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
