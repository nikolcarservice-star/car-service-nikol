import { redirect } from 'next/navigation';

/**
 * Редирект на обновлённую CRM 1.1 (в этом же приложении).
 * После деплоя на Vercel /admin и /crm ведут на новый интерфейс.
 */
export default function AdminRedirectPage() {
  redirect('/crm');
}

