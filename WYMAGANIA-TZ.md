# Wymagania i TZ — strona Car Service Nikol

## Cel
Strona ma **bezpłatnie przyciągać klientów z wyszukiwarki** (SEO) i **szybko przekładać wizyty** (konwersje). Działamy tylko w weekend: sobota 8–18, niedziela 10–16. Lokalizacja: **Jastrowo (Szamotuły)**.

---

## Co musi mieć dobra strona warsztatu (SEO + konwersje)

1. **Lokalne SEO**
   - Poprawna nazwa i adres (Jastrowo, Szamotuły), NAPIS w stopce i na stronie Kontakt.
   - Schema.org (LocalBusiness / AutoRepair) z godzinami i adresem.
   - Osobne podstrony pod usługi (np. „wymiana oleju Jastrowo”, „mechanik Szamotuły”) — każda z opisem, cenami i „dlaczego u nas”.
   - Sitemap.xml, robots.txt, meta title/description na każdej stronie.
   - **Opinie z Google** na stronie (widget) — budują zaufanie i sygnał dla Google.

2. **Konwersje (klient pisze/dzwoni)**
   - Wyraźne CTA: **WhatsApp** i **Zadzwoń** (z napisem „Zadzwoń”, nie tylko numer).
   - Godziny otwarcia widoczne (sobota 8–18, niedziela 10–16).
   - Sekcja **Dlaczego my** — osobna strona z argumentami (ceny, dojazd, uczciwość, itd.).

3. **Metryki**
   - **Google Analytics 4 (GA4)** — ruch, skąd wchodzą, które strony.
   - **Google Tag Manager (GTM)** — jedna skrzynka na tagi (GA4, konwersje, ewentualnie reklamy).
   - Śledzenie **konwersji**: klik w WhatsApp, klik „Zadzwoń”, klik w Telegram.

4. **Zaufanie**
   - Opinie z Google (live widget).
   - Przejrzysty cennik (także wyjazd mistrza).
   - Krótkie „O nas” i „Dlaczego my”.

---

## Co muszę od Ciebie dostać

Żeby dokończyć stronę i włączyć „żywe” elementy, potrzebuję:

### 1. **Opinie z Google (live)**
Żeby wyświetlać **aktualne** opinie z Google na stronie, potrzebuję jednego z poniższych:

- **Opcja A (najprostsza):**  
  Link do Twojej **wizytówki w Google** (Google Moja Firma), np.  
  `https://www.google.com/maps/place/...`  
  Na tej podstawie można dobrać **Place ID** i wstawić gotowy widget (np. Elfsight Google Reviews — płatny, ale bez programowania) albo prosty skrypt.

- **Opcja B:**  
  **Place ID** Twojego miejsca.  
  Jak znaleźć: [Place ID – Google](https://developers.google.com/maps/documentation/places/web-service/place-id) — wpisujesz adres (Wernisazowa 21, Jastrowo) i dostajesz ID.  
  Przykład: `ChIJ...` (długi ciąg znaków).  
  Wystarczy, że mi go wkleisz — dopasuję widget/API.

- **Opcja C:**  
  Jeśli masz już **kod iframe lub skrypt** od usługi do osadzania opinii (np. Elfsight, EmbedSocial) — wklej go, a ja wstawię go w sekcję „Opinie” na stronie.

**Bez tego:** na stronie zostanie placeholder z tekstem „Tu pojawią się opinie z Google” i krótką instrukcją. Możesz potem wkleić link/Place ID/widget.

---

### 2. **Adres i kod pocztowy**
Potwierdzenie:
- **Ulica, numer:** Wernisazowa 21  
- **Miejscowość:** Jastrowo (Szamotuły)  
- **Kod pocztowy:** ? (np. 64-500 Szamotuły czy inny dla Jastrowo — napisz dokładnie)

Jak tylko potwierdzisz, wszędzie ustawię jednolity adres.

---

### 3. **Metryki (opcjonalnie, ale warto)**
- **Google Analytics 4:**  
  Załóż konto na [analytics.google.com](https://analytics.google.com), utwórz „Właściwość” (strona www) i skopiuj **ID pomiaru** (np. `G-XXXXXXXXXX`).  
  Wklej mi je — dodam kod GA4 na całą stronę.

- **Google Tag Manager:**  
  Jeśli chcesz używać GTM, załóż kontener na [tagmanager.google.com](https://tagmanager.google.com) i podaj mi **ID kontenera** (np. `GTM-XXXXXXX`).  
  Wtedy GA4 i ewentualne eventy konwersji można zarządzać z GTM.

Bez tych ID strona będzie działać normalnie; w kodzie będą tylko **placeholdery** (komentarze), gdzie później wkleisz ID.

---

### 4. **Mapa Google**
Jeśli masz **gotowy kod do osadzenia mapy** (Google Maps → Udostępnij → W osadź mapę) — wklej go. Wstawię go na stronę Kontakt.  
Jeśli nie — zostawiam link „Otwórz w Google Maps” i placeholder pod iframe; możesz później wkleić kod.

---

## Podsumowanie — co Ty robisz

| Co | Daj mi |
|----|--------|
| **Opinie Google (live)** | Link do wizytówki Google **albo** Place ID **albo** gotowy kod widgetu |
| **Adres** | Potwierdzenie: Wernisazowa 21, Jastrowo (Szamotuły), kod pocztowy |
| **GA4** (opcjonalnie) | ID pomiaru, np. `G-XXXXXXXXXX` |
| **GTM** (opcjonalnie) | ID kontenera, np. `GTM-XXXXXXX` |
| **Mapa** | Opcjonalnie: kod iframe z Google Maps |

Jak tylko to prześlesz, dokończę: wstawię opinie, poprawię adres wszędzie i podłączę metryki.
