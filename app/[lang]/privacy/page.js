import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/privacy`;
  const languages = { pl: `${SITE_URL}/pl/privacy`, ru: `${SITE_URL}/ru/privacy` };

  if (lang === 'ru') {
    return {
      title: 'Политика конфиденциальности (RODO) – Car Service Nikol',
      description:
        'Политика конфиденциальности и обработки персональных данных Car Service Nikol. RODO, контакт.',
      alternates: { canonical, languages },
    };
  }
  return {
    title: 'Polityka Prywatności (RODO) – Car Service Nikol',
    description:
      'Polityka prywatności i przetwarzania danych osobowych Car Service Nikol. RODO, kontakt.',
    alternates: { canonical, languages },
  };
}

const privacyContent = {
  pl: {
    title: 'Polityka Prywatności (RODO)',
    intro:
      'Car Service Nikol z siedzibą w Jastrowo (ul. Wernisażowa 21, 64-500) przetwarza dane osobowe w związku z obsługą klientów, umawianiem wizyt i wystawianiem faktur.',
    sections: [
      {
        title: 'Administrator danych',
        text: 'Administratorem Twoich danych jest Car Service Nikol. Kontakt: ul. Wernisażowa 21, 64-500 Jastrowo; tel. +48 794 935 734.',
      },
      {
        title: 'Cel i podstawa przetwarzania',
        text: 'Dane przetwarzamy w celu umówienia wizyty, wykonania usługi, wystawienia faktury oraz kontaktu – na podstawie wykonania umowy lub zgody.',
      },
      {
        title: 'Prawa',
        text: 'Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia skargi do PUODO.',
      },
    ],
    back: 'Wróć do strony głównej',
  },
  ru: {
    title: 'Политика конфиденциальности (RODO)',
    intro:
      'Car Service Nikol (адрес: Jastrowo, ul. Wernisażowa 21, 64-500) обрабатывает персональные данные в связи с обслуживанием клиентов, записью на приём и выставлением счетов.',
    sections: [
      {
        title: 'Администратор данных',
        text: 'Администратором ваших данных является Car Service Nikol. Контакт: ul. Wernisażowa 21, 64-500 Jastrowo; тел. +48 794 935 734.',
      },
      {
        title: 'Цель и основание обработки',
        text: 'Данные обрабатываются для записи на приём, оказания услуг, выставления счетов и связи – на основании исполнения договора или согласия.',
      },
      {
        title: 'Права',
        text: 'Вы имеете право на доступ к данным, их исправление, удаление, ограничение обработки, перенос, а также на подачу жалобы в надзорный орган.',
      },
    ],
    back: 'Вернуться на главную',
  },
};

export default function PrivacyPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const content = privacyContent[lang];
  const basePath = `/${lang}`;

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
            { label: content.title },
          ]}
        />
        <h1 className="mt-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
          <ShieldCheck className="h-7 w-7 text-orange-400" />
          {content.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-300 sm:text-base">{content.intro}</p>
        <div className="mt-6 space-y-4">
          {content.sections.map((section, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="text-sm font-semibold text-gray-100 sm:text-base">{section.title}</h2>
              <p className="mt-1 text-xs text-gray-300 sm:text-sm">{section.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8">
          <Link
            href={basePath}
            className="text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            ← {content.back}
          </Link>
        </p>
      </div>
    </section>
  );
}
