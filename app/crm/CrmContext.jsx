'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEYS = {
  language: 'nikol_crm_lang',
  user: 'nikol_crm_user',
};

const defaultUser = { username: 'admin', role: 'admin' };

const CrmContext = createContext(null);

export function CrmProvider({ children }) {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.language);
      if (savedLang === 'ru' || savedLang === 'pl') setLanguage(savedLang);
      const savedUser = localStorage.getItem(STORAGE_KEYS.user);
      if (savedUser) setUser(JSON.parse(savedUser));
      else setUser(defaultUser);
    } catch {
      setUser(defaultUser);
    }
  }, []);

  const setLanguageAndSave = useCallback((lang) => {
    setLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.language, lang);
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.user);
    } catch {}
  }, []);

  const login = useCallback((u) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
    } catch {}
  }, []);

  return (
    <CrmContext.Provider
      value={{
        user,
        language,
        setLanguage: setLanguageAndSave,
        logout,
        login,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used inside CrmProvider');
  return ctx;
}
