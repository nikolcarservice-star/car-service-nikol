import './globals.css';

export const metadata = {
  title: 'Car Service Nikol – serwis samochodowy Jastrowo, Szamotuły',
  description:
    'Car Service Nikol – Mechanik Jastrowo, serwis samochodowy Szamotuły. Naprawa aut Jastrowo, warsztat samochodowy czynny w niedzielę. Zawieszenie, hamulce, wymiana oleju, diagnostyka, klimatyzacja.',
  keywords:
    'Mechanik Jastrowo, Serwis samochodowy Szamotuły, Naprawa aut Jastrowo, Warsztat samochodowy czynny w niedzielę, Car Service Nikol',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

