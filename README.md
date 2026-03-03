# Car Service Nikol — strona warsztatu

Strona wielojęzyczna (PL, EN, RU) dla warsztatu samochodowego Car Service Nikol, **Jastrowo (Szamotuły)**. Godziny: sobota 8–18, niedziela 10–16.

## Zawartość

- **Strona główna** — hero z godziny + CTA (WhatsApp, Zadzwoń), usługi, opinie (placeholder), dlaczego my
- **Usługi** — lista z linkami do osobnych podstron: przeglądy/olej, diagnostyka, hamulce, zawieszenie, rozrząd/napęd, silnik/elektryka, wydech, dojazd mistrza (każda z opisem, cenami, „dlaczego u nas”)
- **Dlaczego my** — osobna strona z argumentami
- **Cennik** — pełna tabela (z dojazdem mistrza; bez klimatyzacji)
- **Rezerwacja** — umów wizytę (link WhatsApp + telefon)
- **O nas** — lokalizacja, sposób pracy
- **Kontakt** — adres, telefon (Zadzwoń), WhatsApp, mapa

Wersje językowe: **PL** (główna, w katalogu głównym), **EN** (katalog `/en/`), **RU** (katalog `/ru/`).

## SEO

- Meta title i description na każdej stronie
- Schema.org `AutoRepair` (LocalBusiness) na stronie głównej PL
- `hreflang` i `canonical` dla PL/EN/RU
- `sitemap.xml` i `robots.txt`
- Słowa kluczowe: Jastrowo, okolice Poznania, Piła, warsztat samochodowy, mechanik

## Przed wdrożeniem

1. **Domena**  
   Zamień `https://carservicenikol.pl` na swoją domenę we wszystkich plikach:
   - `index.html`, `uslugi.html`, `cennik.html`, `o-nas.html`, `kontakt.html` (linki canonical, alternate)
   - pliki w `en/` i `ru/`
   - `sitemap.xml`

2. **Mapa Google**  
   Na stronie Kontakt jest iframe z mapą. Aby wstawić dokładną mapę swojego miejsca:
   - Otwórz [Google Maps](https://www.google.com/maps), znajdź „Wernisazowa 21, Jastrowie”
   - Kliknij „Udostępnij” → „W osadź mapę” → skopiuj kod iframe
   - Wklej go w `kontakt.html` i w `en/contact.html`, `ru/kontakt.html` w sekcji `<div class="map-wrap">`

3. **Google Moja Firma**  
   Uzupełnij profil (godziny, zdjęcia, opis) i linkuj do strony — to wzmocni SEO lokalne.

## Hosting

Strona to statyczny HTML/CSS/JS. Można ją wgrać na:
- dowolny hosting (np. home.pl, cyber_Folks, Netlify, GitHub Pages)
- katalog główny domeny lub subdomeny

Ważne: pliki muszą być w głównym katalogu tak, aby:
- `index.html` był stroną główną (PL)
- `en/index.html` — strona główna EN
- `ru/index.html` — strona główna RU

## Kontakt na stronie

- **Adres:** Wernisazowa 21, 64-500 Jastrowo  
- **Tel:** +48 794 935 734  
- **WhatsApp:** [wa.me/48794935734](https://wa.me/48794935734)

Przyciski WhatsApp są na każdej stronie (pływający przycisk + CTA w treści).
