import { Fragment } from 'react';

/**
 * Dozwolone href dla treści z czatu (HTML <a> od modelu).
 */
function isAllowedHref(href) {
  if (!href || typeof href !== 'string') return false;
  const h = href.trim().replace(/\s/g, '');
  if (/^tel:\+?[0-9]{9,15}$/i.test(h)) return true;
  try {
    const u = new URL(href.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Dzieli tekst na fragmenty tekstu i bezpieczne linki <a href="...">...</a> (cudzysłów podwójny).
 */
export function splitNikolMessageWithLinks(text) {
  if (!text || typeof text !== 'string') return [{ type: 'text', value: '' }];
  const re = /<a\s+[^>]*href\s*=\s*"([^"]+)"[^>]*>([^<]*)<\/a>/gi;
  const parts = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    const href = (m[1] ?? '').trim();
    const label = (m[2] ?? '').trim();
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) });
    }
    if (isAllowedHref(href)) {
      parts.push({ type: 'link', href, label: label || href });
    } else {
      parts.push({ type: 'text', value: m[0] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }
  if (!parts.length) return [{ type: 'text', value: text }];
  return parts;
}

/**
 * Renderuje wiadomość asystenta z klikalnymi linkami (tylko bezpieczne href).
 */
export function NikolAssistantMessageBody({ text, linkClassName }) {
  const parts = splitNikolMessageWithLinks(text);
  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((p, i) => {
        if (p.type === 'text') {
          return <Fragment key={i}>{p.value}</Fragment>;
        }
        const tel = p.href.startsWith('tel:');
        return (
          <a
            key={i}
            href={p.href}
            className={linkClassName}
            {...(tel
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {p.label}
          </a>
        );
      })}
    </p>
  );
}
