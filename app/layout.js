import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Car Service Nikol – serwis Jastrowo, Szamotuły',
  description:
    'Car Service Nikol – Mechanik Jastrowo, serwis samochodowy Szamotuły. Naprawa aut Jastrowo, warsztat czynny w niedzielę. Zawieszenie, hamulce, olej.',
  keywords:
    'Mechanik Jastrowo, Serwis samochodowy Szamotuły, Naprawa aut Jastrowo, Warsztat samochodowy czynny w niedzielę, Car Service Nikol',
  alternates: { canonical: '/pl' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

