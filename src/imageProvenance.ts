import type { ImageProvenance } from './data/generatedImages.ts';

export function versionLabel(provenance?: ImageProvenance): string {
  const version = provenance?.modelVersion;
  if (!version) {
    return provenance?.modelFamily
      ? `${provenance.modelFamily} · Version not disclosed` : 'Version not disclosed';
  }
  return version.certainty === 'expected' ? `${version.label} (expected)` : version.label;
}

export function generationDate(provenance?: ImageProvenance): string {
  if (!provenance) return 'Date not recorded';
  const date = new Date(provenance.generatedAt);
  if (Number.isNaN(date.getTime())) return 'Date not recorded';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}
