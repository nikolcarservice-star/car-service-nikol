'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { getTranslations, LANGUAGES } from '../constants/translations';
import { NikolAssistantMessageBody } from '../utils/nikolMessageLinks';
import { nikolErrorCopyForUserMessage } from '../utils/nikolChatErrorCopy';

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
        setMessages((prev) => [...prev, { role: 'assistant', content: errCopy.errorUnavailable }]);
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

  return (
    <div
      className="fixed bottom-5 right-4 z-[55] hidden flex-col items-end pb-[env(safe-area-inset-bottom,0)] sm:bottom-6 sm:right-6 md:flex"
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
                    alt=""
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
        <div
          className="mb-3 flex max-h-[min(70vh,520px)] min-h-0 w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/95 shadow-2xl backdrop-blur-sm"
          role="dialog"
          aria-label={copy.title}
          aria-modal="true"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 bg-slate-900/90 px-4 py-3">
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

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
            <div className="flex justify-start gap-2">
              <img
                src={AVATAR_SRC}
                alt=""
                width={32}
                height={32}
                className={avatarBubbleClass}
                aria-hidden
                loading="eager"
                decoding="async"
              />
              <div className="max-w-[min(100%,18rem)] rounded-2xl bg-slate-800 px-3 py-2 text-sm leading-relaxed text-slate-100 sm:max-w-[85%]">
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
                    alt=""
                    width={32}
                    height={32}
                    className={avatarBubbleClass}
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div
                  className={`max-w-[min(100%,18rem)] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[85%] ${
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
                  alt=""
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

          <div className="border-t border-slate-700/80 p-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={copy.placeholder}
                rows={2}
                disabled={loading}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-60"
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
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${fabBase} h-14 w-14 shrink-0 animate-cta-glow sm:h-16 sm:w-16`}
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
            alt=""
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
  );
}
