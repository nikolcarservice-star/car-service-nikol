import { redirect } from 'next/navigation';

/**
 * CRM доступна только по https://car-service-nikol-crm.vercel.app/
 * С основного сайта — редирект туда (редректы /admin и /crm заданы в middleware).
 */
export default function AdminRedirectPage() {
  redirect('https://car-service-nikol-crm.vercel.app/');
}

