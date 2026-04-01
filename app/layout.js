import './globals.css';
import Script from 'next/script';
import { headers } from 'next/headers';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-8ZGESKN77X';
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const schemaDescriptions = {
  pl:
    'Car Service Nikol – profesjonalny serwis samochodowy Jastrowo i Szamotuły. Mechanik, diagnostyka, naprawa zawieszenia i hamulców, wymiana oleju. Otwarte w soboty i niedziele.',
  ru:
    'Car Service Nikol – профессиональный автосервис Jastrowo и Шамотулы. Механик, диагностика, ремонт подвески и тормозов, замена масла. Работаем в субботу и воскресенье.',
};

function buildJsonLd(lang) {
  const description = schemaDescriptions[lang] || schemaDescriptions.pl;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: 'Car Service Nikol',
    description,
    url: siteUrl,
    telephone: '+48 794 935 734',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Wernisażowa 21',
      addressLocality: 'Jastrowo',
      postalCode: '64-500',
      addressRegion: 'Wielkopolskie',
      addressCountry: 'PL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.5908375,
      longitude: 16.5384497,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '16:00' },
    ],
    areaServed: [{ '@type': 'City', name: 'Jastrowo' }, { '@type': 'City', name: 'Szamotuły' }],
  };
}

function buildJsonLdOrganization(lang) {
  const description = schemaDescriptions[lang] || schemaDescriptions.pl;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Car Service Nikol',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Wernisażowa 21',
      addressLocality: 'Jastrowo',
      postalCode: '64-500',
      addressCountry: 'PL',
    },
    telephone: '+48 794 935 734',
  };
}

const title = 'Car Service Nikol – Profesjonalny serwis samochodowy w Jastrowo';
const description =
  'Car Service Nikol – profesjonalny serwis samochodowy Jastrowo i Szamotuły. Mechanik, diagnostyka, naprawa zawieszenia i hamulców, wymiana oleju. Otwarte w soboty i niedziele.';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f172a',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords:
    'serwis samochodowy Jastrowo, weekendowy serwis Jastrowo, mechanik Szamotuły, diagnostyka samochodowa Jastrowo, naprawa hamulców Szamotuły, wymiana oleju i filtrów Jastrowo, Car Service Nikol',
  alternates: { canonical: '/pl' },
  authors: [{ name: 'Car Service Nikol', url: siteUrl }],
  creator: 'Car Service Nikol',
  publisher: 'Car Service Nikol',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    siteName: 'Car Service Nikol',
    title,
    description,
    images: [
      {
        url: '/images/services/mechanic-changing-tires-car-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Car Service Nikol – serwis samochodowy Jastrowo, Szamotuły',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/services/mechanic-changing-tires-car-service.jpg'],
  },
  ...(googleSiteVerification && {
    verification: { google: googleSiteVerification },
  }),
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const lang = headersList.get('x-lang') === 'ru' ? 'ru' : 'pl';
  const jsonLd = buildJsonLd(lang);
  const jsonLdOrganization = buildJsonLdOrganization(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}

