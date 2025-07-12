import spells from '$lib/data/spells.json';
import classes from '$lib/data/classes.json';

export function getAllClassNames() {
	return classes.map((cls) => cls.name);
}

export function getSpellcastingClassNames() {
	return classes.filter((cls) => cls.has_spells).map((cls) => cls.name);
}

export function getAllSpells() {
	return spells;
}

export function getSpellBySlug(slug) {
	return spells.find((s) => s.slug === slug);
}
