'use client';

import { useState } from 'react';
import { useCrm } from './CrmContext';
import { Card } from '@/components/crm/Card';
import { Button } from '@/components/crm/Button';
import { Input } from '@/components/crm/Input';

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'master', password: 'master123', role: 'master' },
];

const labels = {
  ru: {
    title: 'Car Service Nikol',
    subtitle: 'Внутренняя CRM',
    username: 'Логин',
    password: 'Пароль',
    login: 'Войти',
    wrong: 'Неверный логин или пароль',
    hint: 'admin / admin123 (Админ), master / master123 (Мастер)',
  },
  pl: {
    title: 'Car Service Nikol',
    subtitle: 'Wewnętrzny CRM',
    username: 'Login',
    password: 'Hasło',
    login: 'Zaloguj',
    wrong: 'Nieprawidłowy login lub hasło',
    hint: 'admin / admin123 (Admin), master / master123 (Mechanik)',
  },
};

export function LoginForm() {
  const { login, language } = useCrm();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const t = labels[language] || labels.ru;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const u = username.trim();
    const p = password.trim();
    const found = USERS.find((x) => x.username === u && x.password === p);
    if (found) {
      login({ username: found.username, role: found.role });
    } else {
      setError(t.wrong);
    }
  };

  return (
    <div className="crm-root min-h-screen flex items-center justify-center p-4 bg-[var(--crm-bg)]">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-crm-text mb-1 text-center">
          {t.title}
        </h1>
        <p className="text-sm text-crm-textMuted mb-6 text-center">
          {t.subtitle}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.username}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label={t.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={error}
          />
          <Button type="submit" variant="primary" className="w-full">
            {t.login}
          </Button>
        </form>
        <p className="mt-4 text-xs text-crm-textMuted text-center">
          {t.hint}
        </p>
      </Card>
    </div>
  );
}
