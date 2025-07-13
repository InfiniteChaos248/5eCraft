<script>
	let mobileMenuOpen = false;
	let referencesOpen = false;

	const referencesLinks = [
		{ href: '/spells', label: 'Spells' },
		{ href: '/feats', label: 'Feats' },
		{ href: '/items', label: 'Items' }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function toggleReferences() {
		referencesOpen = !referencesOpen;
	}

	function closeAll() {
		mobileMenuOpen = false;
		referencesOpen = false;
	}
</script>

<nav class="navbar">
	<a class="navbar-brand" href="/" onclick={closeAll}>5eCraft</a>

	<button class="menu-toggle" onclick={toggleMobileMenu}> ☰ </button>

	<div class="nav-links {mobileMenuOpen ? 'open' : ''}">
		<div class="dropdown {referencesOpen ? 'open' : ''}">
			<span
				class="nav-link dropdown-toggle"
				role="button"
				tabindex="0"
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						toggleReferences();
					}
				}}
				onclick={toggleReferences}
			>
				References ▾
			</span>
			<div class="dropdown-menu">
				{#each referencesLinks as link}
					<a href={link.href} onclick={closeAll}>{link.label}</a>
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.navbar {
		background-color: #111827;
		color: #ffffff;
		font-family: 'Segoe UI', 'Roboto', sans-serif;
		padding: 0.75rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		position: relative;
	}

	.navbar-brand {
		font-size: 1.5rem;
		color: #818cf8;
		text-decoration: none;
		font-weight: bold;
	}

	.navbar-brand:hover {
		color: #a5b4fc;
	}

	.menu-toggle {
		display: none;
		cursor: pointer;
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-link {
		color: #e5e7eb;
		text-decoration: none;
		font-size: 1.1rem;
		position: relative;
	}

	.nav-link:hover {
		color: #c7d2fe;
	}

	.dropdown {
		position: relative;
	}

	.dropdown-toggle {
		cursor: pointer;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		background-color: #1f2937;
		border: 1px solid #374151;
		border-radius: 4px;
		display: none;
		flex-direction: column;
		margin-top: 0.5rem;
		min-width: 160px;
		z-index: 10;
	}

	.dropdown-menu a {
		padding: 0.5rem 1rem;
		color: #e5e7eb;
		text-decoration: none;
		white-space: nowrap;
	}

	.dropdown-menu a:hover {
		background-color: #374151;
		color: #c7d2fe;
	}

	.dropdown.open .dropdown-menu {
		display: flex;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: block;
		}

		.nav-links {
			display: none;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
		}

		.nav-links.open {
			display: flex;
		}

		.dropdown-menu {
			position: static;
			border: none;
			background: none;
			margin: 0;
			padding-left: 1rem;
		}

		.dropdown-menu a {
			padding: 0.25rem 0;
		}
	}
</style>
