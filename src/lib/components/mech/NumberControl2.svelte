<script>
	let {
		number_display = $bindable(),
		number_value = $bindable(),
		min = 0,
		max = -1,
		express_counter = -1
	} = $props();
</script>

<div class="number-control">
	{#if express_counter > 0}
		<button
			class="small-btn double-left"
			onclick={() => {
				number_value = Math.max(min, number_value - express_counter);
			}}>&laquo;</button
		>
	{/if}
	<button
		class="small-btn left"
		onclick={() => {
			number_value = Math.max(min, number_value - 1);
		}}>&lsaquo;</button
	>
	<input
		type="number"
		class="number-input"
		bind:value={number_display}
		onchange={() => (number_value = +number_display)}
		{min}
	/>
	<button
		class="small-btn right"
		onclick={() => {
			if (max > 0) {
				number_value = Math.min(max, number_value + 1);
			} else {
				number_value = number_value + 1;
			}
		}}>&rsaquo;</button
	>
	{#if express_counter > 0}
		<button
			class="small-btn double-right"
			onclick={() => {
				if (max > 0) {
					number_value = Math.min(max, number_value + express_counter);
				} else {
					number_value = number_value + express_counter;
				}
			}}>&raquo;</button
		>
	{/if}
</div>

<style>
	.number-control {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		justify-self: center;
	}

	.number-input {
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

	/* ----- RESPONSIVE STYLES ----- */
	@media (max-width: 768px) {
		.number-control {
			gap: 0.2rem;
		}

		.number-input {
			width: 64px;
			font-size: 0.85rem;
			padding: 0.3rem;
		}
	}

	@media (max-width: 300px) {
		.number-control {
			gap: 0.15rem;
		}

		.small-btn {
			width: 22px;
			height: 22px;
			font-size: 0.7rem;
		}

		.number-input {
			width: 56px;
			font-size: 0.8rem;
			padding: 0.25rem;
		}
	}
</style>
