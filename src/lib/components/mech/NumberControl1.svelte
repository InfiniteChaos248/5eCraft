<script>
	let { min, max, value = $bindable(), weapon, onMagEmpty, onMagRefill } = $props();

	function decrement() {
		value = Math.max(min, value - 1);
		if (weapon && value === 0) {
			onMagEmpty(weapon);
		}
	}

	function increment() {
		if (weapon && value === max) {
			onMagRefill(weapon);
			return;
		}
		value = Math.min(max, value + 1);
	}
</script>

<div class="custom-number">
	<button onclick={decrement}>-</button>
	<input type="number" bind:value {min} {max} />
	<button onclick={increment}>+</button>
</div>

<style>
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

	input[type='number'] {
		width: 60px;
		padding: 0.25rem 0.5rem;
		border: 1px solid #0ff;
		border-radius: 6px;
		background: #111;
		color: #0ff;
		font-family: 'Orbitron', sans-serif;
		font-size: 1rem;
		text-align: right;
		outline: none;
	}

	.custom-number {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.custom-number button {
		background: #111;
		color: #0ff;
		border: 1px solid #0ff;
		border-radius: 6px;
		padding: 0.2rem 0.5rem;
		font-family: 'Orbitron', sans-serif;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.custom-number button:hover {
		box-shadow: 0 0 5px #0ff;
		transform: translateY(-1px);
	}
</style>
