import { LANGUAGES, normalizeLang } from '../constants/translations';
import { SERVICE_KEYS, servicesData } from './services';

/**
 * Tekst cennika do system promptu czatu — te same dane co na podstronach /services.
 */
export function getNikolPriceCatalogPromptBlock(lang) {
  const code = normalizeLang(lang) === LANGUAGES.RU ? LANGUAGES.RU : LANGUAGES.PL;
  const lines = [];

  for (const key of SERVICE_KEYS) {
    const entry = servicesData[key]?.[code];
    if (!entry?.prices?.length) continue;
    const title = entry.shortName || entry.name || key;
    lines.push(`• ${title}:`);
    for (const p of entry.prices) {
      const label = typeof p.label === 'string' ? p.label : '';
      const value = typeof p.value === 'string' ? p.value : '';
      if (label && value) lines.push(`  - ${label}: ${value}`);
    }
  }

  return lines.join('\n');
}
