<script>
	// ----- IMPORTS -----
	import NumberControl2 from './NumberControl2.svelte';

	// ----- PROPS -----
	let { mech = $bindable(), mechData } = $props();

	// ----- CONSTANTS -----
	const BATTERY_RULES = mechData.battery;
	const BATTERY_CORE_TYPE = mech.battery.core_type.toLowerCase();
	const ACTIVE_MINUTES = mechData.battery.core_types[BATTERY_CORE_TYPE].activeMinutes;
	const FLIGHT_MINUTES = mechData.battery.flightMinutes;
	const modes = Object.keys(BATTERY_RULES.modes);

	// ----- STATE -----
	// user input (or) calculated value for % of charge to recharge/discharge
	let charge_perc = $state(0);
	let display_charge_perc = $derived.by(() => round(charge_perc));

	// the ID of the charge core that is selected
	let selected_core = $state(-1);

	// mode selector - passive/active/combat
	let selected_mode = $state('passive');

	// calculate the total number of stat boosters that are active (for battery% calculations)
	let boosters = $derived.by(() => {
		let count = 0;
		mech.automation_functions.forEach((f) => {
			if (f.active && f.stat_booster) {
				count++;
			}
		});
		return count;
	});

	// user input for #mins to compute charge consumed
	let minutes = $state(0);

	// user input for #rounds to compute charge consumed
	let rounds = $state(0);

	// (re)compute rate of battery consumption based on mode and boosters
	let rates = $derived.by(() => calcRates(selected_mode));

	// (re)compute amount of charge% consumed for give #mins
	let consumptionMinutes = $derived.by(() => percentConsumedOverTime(selected_mode, 'minutes'));

	// (re)compute amount of charge% consumed for give #rounds
	let consumptionRounds = $derived.by(() => percentConsumedOverTime(selected_mode, 'rounds'));
	// -----------------

	// ----- FUNCTIONS -----
	// helper - convert given #mins to hrs and mins
	function toHoursAndMinutes(totalMinutes) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return `${hours > 0 ? `${hours} hrs` : ''} ${minutes > 0 ? ` ${minutes} mins` : ''}`.trim();
	}

	// helper - round the given value to given decimal places
	function round(value, decimals = BATTERY_RULES.rounding_decimals) {
		return Number(value.toFixed(decimals));
	}

	// event handler - select/unselect charge core
	function select_core(chg_core_id) {
		if (selected_core === chg_core_id) {
			selected_core = -1;
		} else {
			selected_core = chg_core_id;
		}
	}

	// helper - set the value of charge unit status and charge%
	function set_charge_status(chg, status, perc = chg.percentage) {
		chg.status = status;
		chg.percentage = perc;
	}

	// logic - for given charge unit, check and reduce charge% and change status, if required
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

	// logic - iterate all the 'active' and 'ready' charge units to discharge
	function discharge_battery() {
		let cores_swap_counter = 0;
		['active', 'ready'].forEach((status) => {
			mech.battery.chg_units
				.filter((chg) => chg.status === status)
				.forEach((chg) => {
					discharge_charge_unit(chg);
					if (chg.status === 'empty' && charge_perc >= 0) {
						cores_swap_counter++;
					}
				});
		});
		if (charge_perc > 0) cores_swap_counter--;
		if (cores_swap_counter > 0) {
			alert('cycled through ' + cores_swap_counter + ' cores while discharging');
			// swap to the next available charge unit
			let next_ready_core = mech.battery.chg_units.find((chg) => chg.status === 'ready');
			if (next_ready_core) {
				selected_core = next_ready_core.id;
				swap_charge_unit();
			}
		}
	}

	// logic - for given charge unit, check and increase charge% and change status, if required
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

	// logic - iterate all the 'active', 'empty' and 'ready' charge units to recharge
	function recharge_battery() {
		['active', 'empty', 'ready'].forEach((status) => {
			mech.battery.chg_units.filter((chg) => chg.status === status).forEach(recharge_charge_unit);
		});
	}

	// logic - make selected charge unit active
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
		if (BATTERY_CORE_TYPE === 'nuclear') {
			// swapping nuclear cores is risky -- roll d20 - (6 - INTEGRITY)
			let roll_modifier = 6 - mech.stats.style_integrity;
			alert(
				'roll d20' +
					(roll_modifier === 0
						? ''
						: roll_modifier > 0
							? ' - ' + roll_modifier
							: ' + ' + Math.abs(roll_modifier)) +
					' to check for malfunction'
			);
		}

		selected_core = -1;
	}

	// logic - destroy selected charge unit
	function destroy_charge_unit() {
		let chg = mech.battery.chg_units.find((c) => c.id === selected_core);
		if (chg) {
			set_charge_status(chg, 'destroyed', 0);
		}
		selected_core = -1;
	}

	// logic - repair selected charge unit
	function repair_charge_unit() {
		let chg = mech.battery.chg_units.find((c) => c.id === selected_core);
		if (chg && chg.status === 'destroyed') {
			set_charge_status(chg, 'empty', 0);
		}
		selected_core = -1;
	}

	// logic - compute time to use up one charge unit based on core type and active stat boosters
	function effectiveMinutes(current_mode) {
		if (current_mode === 'flight') {
			return FLIGHT_MINUTES;
		}
		const mode = BATTERY_RULES.modes[current_mode];
		let base = ACTIVE_MINUTES * mode.multiplier;
		base = base * (1 - (boosters * BATTERY_RULES.booster_consumption_perc) / 100);
		return base;
	}

	// logic - compute %charge consumed per minute and round
	function calcRates(current_mode) {
		const effMinutes = effectiveMinutes(current_mode);

		const percPerMinute = 100 / effMinutes;
		const percPerRound = percPerMinute / 20;

		return {
			effectiveMinutes: round(effMinutes),
			percPerMinute,
			percPerRound
		};
	}

	// logic - compute total %charge consumed for selected amount of time
	function percentConsumedOverTime(current_mode, timeUnit) {
		const rates = calcRates(current_mode);
		let percent = 0;
		if (timeUnit === 'minutes') {
			percent = minutes * rates.percPerMinute;
		} else if (timeUnit === 'rounds') {
			percent = rounds * rates.percPerRound;
		}
		return percent;
	}

	// event handler - add charge% to be discharged
	function applyChargePercForDischarge() {
		if (minutes < 0) {
			minutes = 0;
			return;
		}
		if (rounds < 0) {
			rounds = 0;
			return;
		}
		charge_perc = charge_perc + consumptionMinutes;
		charge_perc = charge_perc + consumptionRounds;
		rounds = 0;
		minutes = 0;
	}
</script>

<!-- main container -->
<div class="battery-section">
	<h3 class="section-title">BATTERY | {mech.battery.core_type} Core</h3>

	<!-- charge cores -->
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
				<div class="core-text">
					{#if chg.status === 'destroyed'}
						✖
					{:else if chg.percentage % 1 === 0 || round(chg.percentage) % 1 === 0}
						{Math.floor(chg.percentage)}
					{:else}
						<span class="core-main">{Math.floor(chg.percentage)}</span>
						<span class="core-decimals">.{round(chg.percentage).toString().split('.')[1]}</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- charge core actions -->
	<div class="battery-actions">
		<button class="battery-btn discharge" onclick={discharge_battery}>Discharge</button>
		<NumberControl2
			bind:number_display={display_charge_perc}
			bind:number_value={charge_perc}
			min={0}
			max={mech.battery.charge_units * 100}
			express_counter={100}
		/>
		<button class="battery-btn recharge" onclick={recharge_battery}>Recharge</button>
		<button class="battery-btn apply" onclick={applyChargePercForDischarge}>Apply</button>
		<button class="battery-btn swap" onclick={swap_charge_unit}>Swap</button>
		<button class="battery-btn destroy" onclick={destroy_charge_unit}>Destroy</button>
		<button class="battery-btn repair" onclick={repair_charge_unit}>Repair</button>
	</div>

	<!-- mech mode charge consumtion info -->
	<div class="tabs">
		{#each modes as mode}
			<div
				class="tab {selected_mode === mode ? selected_mode : 'inactive'}"
				role="button"
				tabindex="0"
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						selected_mode = mode;
						minutes = 0;
						rounds = 0;
					}
				}}
				onclick={() => {
					selected_mode = mode;
					minutes = 0;
					rounds = 0;
				}}
			>
				{mode.toUpperCase()}
			</div>
		{/each}
		{#if mech.flight}
			<div
				class="tab {selected_mode === 'flight' ? selected_mode : 'inactive'}"
				role="button"
				tabindex="0"
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						selected_mode = 'flight';
						minutes = 0;
						rounds = 0;
					}
				}}
				onclick={() => {
					selected_mode = 'flight';
					minutes = 0;
					rounds = 0;
				}}
			>
				FLIGHT
			</div>
		{/if}
	</div>

	<div class="panel {selected_mode}">
		<div>
			<strong>{rates.effectiveMinutes} mins</strong> ({toHoursAndMinutes(rates.effectiveMinutes)})
		</div>
		<div class="panel-content">
			<div><strong>% per Minute:</strong> {round(rates.percPerMinute)}</div>
			<NumberControl2
				bind:number_display={minutes}
				bind:number_value={minutes}
				min={0}
				express_counter={60}
			/>
			<span>{round(consumptionMinutes)}%</span>
		</div>
		<div class="panel-content">
			<div><strong>% per Round:</strong> {round(rates.percPerRound)}</div>
			<NumberControl2 bind:number_display={rounds} bind:number_value={rounds} min={0} />
			<div>{round(consumptionRounds)}%</div>
		</div>
	</div>
</div>

<style>
	.battery-section {
		padding: 1rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
		margin-top: 0.5rem;
	}

	.section-title {
		font-size: 1.2rem;
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

	.core-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1;
	}

	.core-main {
		font-size: 1.2rem;
	}

	.core-decimals {
		font-size: 0.6rem;
		opacity: 0.8;
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

	.battery-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.6rem;
		margin-top: 1rem;
	}

	.battery-btn {
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		cursor: pointer;
		text-transform: uppercase;
		font-size: 0.85rem;
		font-weight: bold;
		letter-spacing: 1px;
		transition: 0.2s ease;
	}

	.discharge {
		background: rgba(0, 229, 255, 0.1);
		border: 2px solid #00e5ff;
	}
	.discharge:hover {
		box-shadow: 0 0 8px #00e5ff;
		background: rgba(0, 229, 255, 0.2);
	}

	.recharge {
		background: rgba(255, 204, 0, 0.1);
		border: 2px solid #ffcc00;
	}
	.recharge:hover {
		box-shadow: 0 0 8px #ffcc00;
		background: rgba(255, 204, 0, 0.2);
	}

	.swap {
		background: rgba(255, 224, 102, 0.1);
		border: 2px solid #ffe066;
	}
	.swap:hover {
		box-shadow: 0 0 8px #ffe066;
		background: rgba(255, 224, 102, 0.2);
	}

	.apply {
		background: rgba(255, 255, 255, 0.08);
		border: 2px solid #e0e0e0;
		color: #f5f5f5;
	}
	.apply:hover {
		box-shadow: 0 0 8px #ffffff;
		background: rgba(255, 255, 255, 0.15);
	}

	.destroy {
		background: rgba(255, 0, 76, 0.1);
		border: 2px solid #ff004c;
	}
	.destroy:hover {
		box-shadow: 0 0 8px #ff004c;
		background: rgba(255, 0, 76, 0.2);
	}

	.repair {
		background: rgba(57, 255, 20, 0.1);
		border: 2px solid #39ff14;
	}
	.repair:hover {
		box-shadow: 0 0 8px #39ff14;
		background: rgba(57, 255, 20, 0.2);
	}

	.tabs {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}
	.tab {
		flex: 1;
		text-align: center;
		padding: 0.75rem;
		font-weight: bold;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s ease;
	}

	.tab.passive {
		color: #0ff;
		border-color: #0ff;
	}
	.tab.active {
		color: #fffb00;
		border-color: #fffb00;
	}
	.tab.combat {
		color: #ff0080;
		border-color: #ff0080;
	}
	.tab.flight {
		color: blue;
		border-color: blue;
	}

	.tab.inactive {
		color: #fff;
		text-shadow: 0 0 6px #fff;
	}
	.panel {
		border: 1px solid #39ff14;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 0 8px #39ff14 inset;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel.passive {
		border-color: #0ff;
		box-shadow: 0 0 8px #0ff inset;
	}
	.panel.active {
		border-color: #fffb00;
		box-shadow: 0 0 8px #fffb00 inset;
	}
	.panel.combat {
		border-color: #ff0080;
		box-shadow: 0 0 8px #ff0080 inset;
	}

	.panel.flight {
		border-color: blue;
		box-shadow: 0 0 8px blue inset;
	}

	.panel-content {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: center;
	}

	.panel-content > * {
		justify-self: center;
	}

	@media (max-width: 768px) {
		.battery-section {
			padding: 1rem;
		}

		.section-title {
			text-align: center;
			font-size: 1.2rem;
		}

		.core-grid {
			justify-content: center;
			gap: 0.6rem;
		}

		.core {
			width: 48px;
			height: 48px;
			font-size: 1rem;
		}

		.battery-actions {
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.6rem;
		}

		.battery-btn {
			flex: 1 1 45%;
			min-width: 130px;
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.tabs {
			flex-wrap: wrap;
			gap: 0.3rem;
		}

		.tab {
			flex: 1 1 30%;
			padding: 0.5rem;
			font-size: 0.85rem;
		}

		/* Stack panel content vertically */
		.panel {
			gap: 0.8rem;
		}

		.panel-content {
			grid-template-columns: 1fr;
			gap: 0.6rem;
		}

		.panel-content > * {
			justify-self: center;
			text-align: center;
		}
	}

	/* Extra-small screens (phones <480px wide) */
	@media (max-width: 480px) {
		.core {
			width: 40px;
			height: 40px;
			font-size: 0.9rem;
		}

		.battery-btn {
			flex: 1 1 100%;
			font-size: 0.85rem;
		}

		.section-title {
			font-size: 1.1rem;
		}

		.tab {
			flex: 1 1 45%;
		}
	}
</style>
