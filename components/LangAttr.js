'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SUPPORTED = ['pl', 'ru'];

export default function LangAttr() {
  const pathname = usePathname() || '';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const segment = pathname.split('/').filter(Boolean)[0];
    const lang = SUPPORTED.includes(segment) ? segment : 'pl';
    document.documentElement.lang = lang;
  }, [pathname]);

  return null;
}
