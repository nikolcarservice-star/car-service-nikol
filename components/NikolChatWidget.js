'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { getTranslations, LANGUAGES } from '../constants/translations';

const fabBase =
  'flex min-h-[52px] min-w-[52px] items-center justify-center rounded-full text-white shadow-xl transition hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';

export default function NikolChatWidget({ lang = LANGUAGES.PL }) {
  const t = getTranslations(lang);
  const copy = t.nikolChat;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  /** Wymiana z API (bez lokalnego powitania). */
  const [messages, setMessages] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !copy) return;

    const nextUser = { role: 'user', content: text };
    const historyForApi = [...messages, nextUser];
    setMessages((prev) => [...prev, nextUser]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: historyForApi.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 503 && data.error === 'missing_key') {
        setMessages((prev) => [...prev, { role: 'assistant', content: copy.errorUnavailable }]);
        return;
      }

      if (!res.ok || !data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: copy.errorGeneric }]);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: copy.errorGeneric }]);
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
      className="fixed bottom-5 right-4 z-[55] hidden pb-[env(safe-area-inset-bottom,0)] sm:bottom-6 sm:right-6 md:block"
      aria-live="polite"
    >
      {open && (
        <div
          className="mb-3 flex max-h-[min(70vh,520px)] min-h-0 w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/95 shadow-2xl backdrop-blur-sm"
          role="dialog"
          aria-label={copy.title}
          aria-modal="true"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 bg-slate-900/90 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
                <Bot className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <span className="truncate text-sm font-semibold text-white">{copy.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-label={copy.close}
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3"
          >
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl bg-slate-800 px-3 py-2 text-sm leading-relaxed text-slate-100">
                <p className="whitespace-pre-wrap break-words">{copy.welcome}</p>
              </div>
            </div>
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}-${m.content.slice(0, 24)}`}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
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
        className={`${fabBase} h-14 w-14 bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 focus:ring-orange-400 animate-cta-glow sm:h-16 sm:w-16`}
        aria-expanded={open}
        aria-label={open ? copy.close : copy.fabAria}
        title={open ? copy.close : copy.fabAria}
      >
        {open ? (
          <X className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} aria-hidden />
        ) : (
          <Bot className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}
