<script>
	import IntegrityPart from './IntegrityPart.svelte';

	let { mech = $bindable(), mechData } = $props();

	let selected_part_id = $state('');
	let selected_part = $derived.by(() => mech.integrity[selected_part_id]);

	function selectPart(part_id) {
		if (selected_part_id === part_id) {
			selected_part_id = -1;
		} else {
			selected_part_id = part_id;
		}
	}

	function damagePart() {
		if (selected_part.current_integrity === -1) return;
		selected_part.current_integrity--;
		if (selected_part.current_integrity < 0) disconnectParts(selected_part);
	}

	function repairPart() {
		if (selected_part.current_integrity === selected_part.max_integrity) return;
		selected_part.current_integrity++;
		if (selected_part.current_integrity === 0) reconnectParts(selected_part);
	}

	function disconnectParts(part) {
		if (part.disconnects && part.disconnects.length > 0) {
			part.disconnects.forEach((id) => {
				if (mech.integrity[id].type === 'limb' || mech.integrity[id].type === 'head')
					mech.integrity[id].disconnected = true;
			});
		}
	}

	function reconnectParts(part) {
		if (part.disconnects && part.disconnects.length > 0) {
			part.disconnects.every((id) => {
				if (mech.integrity[id].type === 'joint' && mech.integrity[id].current_integrity === -1)
					return false;
				if (mech.integrity[id].type === 'limb' || mech.integrity[id].type === 'head')
					mech.integrity[id].disconnected = false;
				return true;
			});
		}
	}
</script>

<div class="integrity-section">
	<h3 class="section-title">INTEGRITY</h3>

	<div class="info-actions-panel">
		<div class="info">
			{#if selected_part}
				<div class="info-line">
					<span>{selected_part.label}</span>
				</div>
				{#if selected_part.current_integrity === -1}
					<div class="info-line">
						<span class="state damaged">Damaged</span>
					</div>
				{/if}

				{#if selected_part.disconnected}
					<div class="info-line">
						<span class="state disconnected">Disconnected</span>
					</div>
				{/if}

				{#if selected_part.components?.length}
					<div class="info-line">
						<span class="label">Components:</span>
						<span>{selected_part.components.join(', ')}</span>
					</div>
				{/if}
			{:else}
				<div class="info-line placeholder">Select a part to view details</div>
			{/if}
		</div>

		<div class="action-btn-grid">
			<button class="action-btn damage" onclick={damagePart}>Damage</button>
			<button class="action-btn repair" onclick={repairPart}>Repair</button>
		</div>
	</div>

	<section class="parts-section">
		<div class="parts-label">HEAD ({mech.info.max_hp * mechData.integrity.multiplier.head} HP)</div>
		<div class="parts-list">
			{#each Object.values(mech.integrity).filter((x) => x.type === 'head') as part}
				<IntegrityPart {part} {selected_part} {selectPart} />
			{/each}
		</div>
	</section>

	<section class="parts-section">
		<div class="parts-label">
			TORSO ({mech.info.max_hp * mechData.integrity.multiplier.torso} HP)
		</div>
		<div class="parts-list">
			{#each Object.values(mech.integrity).filter((x) => x.type === 'torso') as part}
				<IntegrityPart {part} {selected_part} {selectPart} />
			{/each}
		</div>
	</section>

	<section class="parts-section">
		<div class="parts-label">
			LIMBS ({mech.info.max_hp * mechData.integrity.multiplier.limb} HP)
		</div>
		<div class="parts-list">
			{#each Object.values(mech.integrity).filter((x) => x.type === 'limb') as part}
				<IntegrityPart {part} {selected_part} {selectPart} />
			{/each}
		</div>
	</section>

	<section class="parts-section">
		<div class="parts-label">
			JOINTS ({mech.info.max_hp * mechData.integrity.multiplier.joint} HP)
		</div>
		<div class="parts-list">
			{#each Object.values(mech.integrity).filter((x) => x.type === 'joint') as part}
				<IntegrityPart {part} {selected_part} {selectPart} />
			{/each}
		</div>
	</section>
</div>

<style>
	.integrity-section {
		padding: 1rem;
		border: 2px solid #00f5ff;
		border-radius: 12px;
		background: #111;
		margin-top: 0.5rem;
	}

	.section-title {
		font-size: 1.4rem;
		color: #0ff;
		text-shadow: 0 0 6px #0ff;
		margin: 0;
		margin-bottom: 1rem;
	}

	.info-actions-panel {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 0.5rem;
		padding: 0.3rem;
		background: rgba(20, 20, 30, 0.85);
		border: 2px solid rgba(57, 255, 20, 0.25);
		border-radius: 0.75rem;
	}

	@media (max-width: 768px) {
		.info-actions-panel {
			grid-template-columns: 1fr;
		}
	}

	.info {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: center;
		gap: 2rem;
	}
	.info-line {
		font-size: 0.85rem;
	}
	.label {
		color: #8aff8a;
	}
	.state.damaged {
		color: #ff4d4d;
	}
	.state.disconnected {
		color: #00aaff;
	}
	.placeholder {
		text-align: center;
		color: rgba(200, 255, 200, 0.5);
	}

	.action-btn-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.action-btn {
		border-radius: 0.5rem;
		padding: 0.3rem 0.75rem;
		background: rgba(25, 25, 35, 0.9);
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
		color: #fff;
		cursor: pointer;
		text-transform: uppercase;
		font-size: 0.85rem;
		font-weight: bold;
		letter-spacing: 1px;
		transition: all 0.2s ease;
	}

	.action-btn.damage {
		background: rgba(255, 0, 76, 0.15);
		border: 2px solid #ff004c;
	}
	.action-btn.damage:hover {
		box-shadow: 0 0 8px #ff004c;
		background: rgba(255, 0, 76, 0.25);
		filter: drop-shadow(0 0 4px #ff004c);
	}

	.action-btn.repair {
		background: rgba(57, 255, 20, 0.15);
		border: 2px solid #39ff14;
	}
	.action-btn.repair:hover {
		box-shadow: 0 0 8px #39ff14;
		background: rgba(57, 255, 20, 0.25);
		filter: drop-shadow(0 0 4px #39ff14);
	}

	.parts-label {
		margin-top: 10px;
		margin-bottom: 3px;
	}

	.parts-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 0.5rem;
	}

	@media (max-width: 400px) {
		.action-btn {
			font-size: 0.7rem;
		}

		.placeholder {
			font-size: 0.8rem;
		}
	}
</style>
