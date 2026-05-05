'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { getTranslations, LANGUAGES } from '../constants/translations';
import { WHATSAPP_HREF } from '../constants/contactLinks';
import { NikolAssistantMessageBody } from '../utils/nikolMessageLinks';
import { nikolErrorCopyForUserMessage } from '../utils/nikolChatErrorCopy';

const NIKOL_CHAT_OPEN_EVENT = 'nikol-chat-open';

export function openNikolChatFromUi() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NIKOL_CHAT_OPEN_EVENT));
}

const messengerFabClass =
  'flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 sm:h-12 sm:w-12';

const NUDGE_DELAY_MS = 20_000;
const NUDGE_AUTOHIDE_MS = 50_000;
const NUDGE_SESSION_KEY = 'nikol_chat_nudge_v1';

function sanitizeApiReason(r) {
  if (typeof r !== 'string' || !r.trim()) return '';
  return r.replace(/AIza[\w-]{10,}/gi, '***').trim().slice(0, 480);
}

/**
 * Awatar z /public. Pełny URL z NEXT_PUBLIC_SITE_URL (np. https://autoserwis-nikol.pl),
 * żeby <img> zawsze brał plik z produkcji — unika problemów z relatywną ścieżką/cache.
 */
const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
const AVATAR_SRC = siteBase ? `${siteBase}/nikol-chat-avatar.png` : '/nikol-chat-avatar.png';

const avatarBubbleClass =
  'h-8 w-8 shrink-0 self-end rounded-full object-cover ring-2 ring-orange-500/40';

const fabBase =
  'relative flex min-h-[52px] min-w-[52px] items-center justify-center overflow-hidden rounded-full shadow-xl ring-2 ring-orange-400/60 ring-offset-2 ring-offset-slate-950 transition hover:scale-110 hover:shadow-2xl hover:ring-orange-300/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export default function NikolChatWidget({ lang = LANGUAGES.PL }) {
  const t = getTranslations(lang);
  const copy = t.nikolChat;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  /** Wymiana z API (bez lokalnego powitania). */
  const [messages, setMessages] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const listRef = useRef(null);

  const avatarAlt = copy?.avatarAlt || 'Nikol — Car Service Nikol';

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (typeof window === 'undefined' || !copy) return;
    if (sessionStorage.getItem(NUDGE_SESSION_KEY)) return;
    const id = window.setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [copy]);

  useEffect(() => {
    if (!showNudge || typeof window === 'undefined') return;
    const id = window.setTimeout(() => setShowNudge(false), NUDGE_AUTOHIDE_MS);
    return () => window.clearTimeout(id);
  }, [showNudge]);

  useEffect(() => {
    if (!open) return;
    setShowNudge(false);
    try {
      sessionStorage.setItem(NUDGE_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(NIKOL_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(NIKOL_CHAT_OPEN_EVENT, onOpen);
  }, []);

  /** Na mobile pełny ekran — blokuj scroll strony pod czatem. */
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const root = document.documentElement;
    const body = document.body;
    const apply = () => {
      if (!open) return;
      if (mq.matches) {
        root.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
      } else {
        root.style.overflow = '';
        body.style.overflow = '';
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      root.style.overflow = '';
      body.style.overflow = '';
    };
  }, [open]);

  const dismissNudge = useCallback(() => {
    setShowNudge(false);
    try {
      sessionStorage.setItem(NUDGE_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !copy) return;

    const nextUser = { role: 'user', content: text };
    const historyForApi = [...messages, nextUser];
    setMessages((prev) => [...prev, nextUser]);
    setInput('');
    setLoading(true);

    const errCopy = nikolErrorCopyForUserMessage(copy, text);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: historyForApi.map(({ role, content }) => ({ role, content })),
        }),
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (typeof data.message === 'string' && data.message.trim()) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message.trim() }]);
        return;
      }

      if (data.error === 'upstream' || data.error === 'server' || data.reason) {
        console.warn('[NikolChat] /api/chat:', data.error || 'fail', data.reason || data);
      }

      if (data.error === 'missing_key') {
        if (data.hint) console.warn('[NikolChat] missing_key:', data.hint);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: errCopy.errorMissingKey ?? errCopy.errorUnavailable },
        ]);
        return;
      }

      if (data.error === 'upstream' || data.error === 'server') {
        const base = errCopy.errorUpstream ?? errCopy.errorGeneric;
        const tech = sanitizeApiReason(data.reason);
        const content = tech ? `${base}\n\n—\n${tech}` : base;
        setMessages((prev) => [...prev, { role: 'assistant', content }]);
        return;
      }

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: errCopy.errorGeneric }]);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: errCopy.errorGeneric }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: errCopy.errorGeneric }]);
    } finally {
      setLoading(false);
    }
  }, [copy, input, loading, lang, messages]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!copy) return null;

  const waLabel = t?.location?.whatsapp ?? 'WhatsApp';

  return (
    <div
      className="fixed bottom-4 right-3 z-[60] flex max-w-[calc(100vw-1rem)] flex-col items-end gap-2 pb-[env(safe-area-inset-bottom,0)] sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {showNudge && !open && copy.nudgeTitle && (
          <motion.div
            key="nikol-nudge"
            role="dialog"
            aria-label={copy.nudgeTitle}
            initial={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
            className="relative mb-3 w-[min(calc(100vw-2rem),300px)] overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-br from-slate-900 via-slate-900/98 to-slate-800/95 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_48px_-12px_rgba(249,115,22,0.35)] backdrop-blur-md"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl"
              aria-hidden
            />
            <button
              type="button"
              onClick={dismissNudge}
              className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-label={copy.nudgeDismissAria}
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
            <div className="relative px-3.5 pb-3.5 pt-3 pr-10">
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  <img
                    src={AVATAR_SRC}
                    alt={avatarAlt}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-orange-400/60 shadow-md"
                    loading="eager"
                    decoding="async"
                    aria-hidden
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 shadow-sm"
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-300/95">
                    <Sparkles className="h-3 w-3 shrink-0 text-amber-400" aria-hidden />
                    Nikol
                  </p>
                  <p className="mt-0.5 text-sm font-bold leading-snug text-white">{copy.nudgeTitle}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{copy.nudgeBody}</p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    {copy.nudgeCta}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[105] bg-slate-950/70 backdrop-blur-[2px] md:hidden"
            aria-label={copy.close}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed inset-0 z-[110] flex h-[100dvh] max-h-[100dvh] min-h-0 w-full flex-col overflow-hidden rounded-none border-0 bg-slate-950 pt-[env(safe-area-inset-top,0px)] shadow-2xl max-md:border-t max-md:border-slate-800 md:relative md:inset-auto md:z-auto md:mb-3 md:h-auto md:max-h-[min(70vh,520px)] md:w-[min(100vw-2rem,400px)] md:rounded-2xl md:border md:border-slate-700/90 md:bg-slate-900/95 md:pt-0 md:shadow-2xl md:backdrop-blur-sm"
            role="dialog"
            aria-label={copy.title}
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700/80 bg-slate-900/95 px-4 py-3 max-md:py-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img
                src={AVATAR_SRC}
                alt={avatarAlt}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-orange-500/45"
                loading="eager"
                decoding="async"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-base font-bold text-white">
                    {copy.headerDisplayName ?? copy.assistantName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    {copy.statusOnline}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400 sm:text-xs">
                  {copy.headerTagline ?? copy.headerSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-label={copy.close}
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3 pb-2">
            <div className="flex justify-start gap-2">
              <img
                src={AVATAR_SRC}
                alt={avatarAlt}
                width={32}
                height={32}
                className={avatarBubbleClass}
                aria-hidden
                loading="eager"
                decoding="async"
              />
              <div className="max-w-[min(92%,22rem)] rounded-2xl bg-slate-800 px-3 py-2.5 text-sm leading-relaxed text-slate-100 sm:max-w-[85%]">
                <p className="whitespace-pre-wrap break-words">{copy.welcome}</p>
              </div>
            </div>
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}-${m.content.slice(0, 24)}`}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' ? (
                  <img
                    src={AVATAR_SRC}
                    alt={avatarAlt}
                    width={32}
                    height={32}
                    className={avatarBubbleClass}
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div
                  className={`max-w-[min(92%,22rem)] rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  ) : (
                    <NikolAssistantMessageBody
                      text={m.content}
                      linkClassName="font-medium text-orange-300 underline decoration-orange-400/80 underline-offset-2 hover:text-orange-200"
                    />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <img
                  src={AVATAR_SRC}
                  alt={avatarAlt}
                  width={32}
                  height={32}
                  className={avatarBubbleClass}
                  aria-hidden
                  loading="eager"
                  decoding="async"
                />
                <div className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-400">
                  {copy.thinking}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-slate-700/80 bg-slate-900/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={copy.placeholder}
                rows={2}
                disabled={loading}
                className="min-h-[48px] flex-1 resize-none rounded-xl border border-slate-600 bg-slate-950/90 px-3 py-2.5 text-[15px] leading-snug text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-60 max-md:text-base"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={copy.send}
              >
                <Send className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      <div
        className={`flex shrink-0 flex-row items-end justify-end gap-1.5 sm:gap-2 ${open ? 'max-md:hidden' : ''}`}
      >
        <div
          className="flex shrink-0 flex-row items-end gap-1.5 sm:gap-2 md:hidden"
          role="group"
          aria-label={lang === 'ru' ? 'Мессенджеры' : 'Szybki kontakt — komunikatory'}
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={waLabel}
            title={waLabel}
            className={`${messengerFabClass} bg-[#25D366] focus-visible:ring-[#25D366]`}
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`${fabBase} max-sm:!min-h-12 max-sm:!min-w-12 h-12 w-12 shrink-0 animate-cta-glow sm:h-14 sm:w-16`}
          aria-expanded={open}
          aria-label={open ? copy.close : copy.fabAria}
          title={open ? copy.close : copy.fabAria}
        >
          {open ? (
            <>
              <span className="absolute inset-0 rounded-full bg-slate-950/90" aria-hidden />
              <X
                className="relative z-10 h-7 w-7 text-white drop-shadow sm:h-8 sm:w-8"
                strokeWidth={2.25}
                aria-hidden
              />
            </>
          ) : (
            <img
              src={AVATAR_SRC}
              alt={avatarAlt}
              width={64}
              height={64}
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              aria-hidden
              loading="eager"
              decoding="async"
            />
          )}
        </button>
      </div>
    </div>
  );
}
