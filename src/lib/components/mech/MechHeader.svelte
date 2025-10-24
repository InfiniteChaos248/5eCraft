<script>
	let { mech, closeMech, syncMech, readOnly } = $props();
</script>

<div class="mech-header">
	<div class="floating-actions">
		<button class="header-btn close" onclick={closeMech}>✖</button>
		<button class="header-btn sync" onclick={syncMech} disabled={readOnly}>⟳</button>
	</div>

	<h2 class="mech-name">{mech.name}</h2>
	<p class="pilot">Pilot: {mech.pilot}</p>
</div>

<style>
	.mech-header {
		position: relative;
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

	.floating-actions {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		gap: 0.5rem;
	}

	.header-btn {
		background: rgba(25, 25, 35, 0.9);
		color: #e0faff;
		border: 2px solid rgba(0, 245, 255, 0.5);
		border-radius: 6px;
		font-family: 'Orbitron', sans-serif;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		padding: 0.3rem 0.6rem;
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.header-btn:hover {
		background: rgba(0, 245, 255, 0.15);
		box-shadow: 0 0 6px #00f5ff;
	}

	.header-btn:disabled {
		cursor: not-allowed;
		opacity: 0.5;
		filter: grayscale(80%);
		background: rgba(50, 50, 60, 0.6);
		border-color: rgba(100, 100, 120, 0.5);
		color: #777;
		box-shadow: none;
		transform: none;
	}

	.header-btn.close {
		border-color: rgba(255, 0, 80, 0.6);
		color: #ff4d6d;
	}

	.header-btn.close:hover {
		background: rgba(255, 0, 80, 0.15);
		box-shadow: 0 0 6px #ff4d6d;
	}

	.header-btn.sync {
		border-color: rgba(0, 245, 255, 0.6);
		color: #00f5ff;
	}
</style>
