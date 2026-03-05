import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Car Service Nikol',
  description:
    'Car Service Nikol – Mechanik Jastrowo, serwis samochodowy Szamotuły. Naprawa aut Jastrowo, warsztat czynny w niedzielę. Zawieszenie, hamulce, olej.',
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

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Car Service Nikol',
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  description:
    'Serwis samochodowy w Jastrowo, Szamotuły. Naprawa zawieszenia, hamulce, wymiana oleju, diagnostyka. Warsztat czynny w niedzielę.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Wernisażowa 21',
    addressLocality: 'Jastrowo',
    postalCode: '64-500',
    addressCountry: 'PL',
  },
  telephone: '+48 794 935 734',
};

const title = 'Car Service Nikol – serwis Jastrowo, Szamotuły';
const description =
  'Car Service Nikol – Mechanik Jastrowo, serwis samochodowy Szamotuły. Naprawa aut Jastrowo, warsztat czynny w niedzielę. Zawieszenie, hamulce, olej.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords:
    'Mechanik Jastrowo, Serwis samochodowy Szamotuły, Naprawa aut Jastrowo, Warsztat samochodowy czynny w niedzielę, Car Service Nikol',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {children}
      </body>
    </html>
  );
}

