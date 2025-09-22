import spells from '$lib/data/spells.json';
import classes from '$lib/data/classes.json';
import feats from '$lib/data/feats.json';
import mechs from '$lib/data/mechs.json';
import mechData from '$lib/data/mech_data.json';

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

export function getAllFeats() {
	return feats;
}

export function getFeatBySlug(slug) {
	return feats.find((f) => f.slug === slug);
}

export function getAllMechs() {
	return mechs;
}

export function getMechBySlug(slug) {
	return mechs.find((m) => m.slug === slug);
}

export function getmechData() {
	return mechData;
}
