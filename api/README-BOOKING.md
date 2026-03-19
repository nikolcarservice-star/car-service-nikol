# API проекта (Vercel)

## Endpoints

- **`POST /api/booking`** — заявки с формы записи (см. ниже).
- **`GET /api/prices`** — мониторинг цен (Познань и окрестности). URL: `https://ваш-проект.vercel.app/api/prices`.

После добавления или изменения файлов в `api/` обязательно **задеплойте проект заново** (push в Git или `vercel --prod`), иначе новый endpoint будет отдавать 404.

---

# Заявки с формы записи

Форма «Umów wizytę» / «Запись онлайн» отправляет данные в API `POST /api/booking`, который может пересылать их на внешний webhook.

## Настройка

1. **Деплой**  
   Разверните проект на Vercel (корень репозитория с `vercel.json`). Будет доступен endpoint: `https://ваш-проект.vercel.app/api/booking`.

2. **Webhook (опционально)**  
   В настройках проекта Vercel добавьте переменную окружения:
   - **`BOOKING_WEBHOOK_URL`** — URL, на который нужно отправлять заявки (Make.com, Zapier, Bitrix24, Google Sheets и т.п.).

   Примеры:
   - Make.com: URL сценария (Webhooks → Custom webhook).
   - Zapier: URL шага «Webhooks by Zapier» (POST).
   - Bitrix24: URL входящего вебхука REST.

3. **Формат тела запроса (JSON)**  
   На webhook уходит объект:
   ```json
   {
     "source": "car-service-nikol-booking",
     "name": "Имя клиента",
     "phone": "+48 ...",
     "car": "VW, BMW",
     "service": "Programowanie kluczy",
     "date": "sobota 14.03",
     "message": "Krótki opis",
     "lang": "pl",
     "createdAt": "2025-03-02T12:00:00.000Z"
   }
   ```

4. **Если форма на другом домене**  
   Если сайт размещён не на Vercel (например, на Netlify), в HTML перед скриптом формы задайте URL API:
   ```html
   <script>window.BOOKING_API_URL = 'https://ваш-проект.vercel.app/api/booking';</script>
   ```

После отправки форма по-прежнему открывает WhatsApp с готовым сообщением; заявка при необходимости параллельно уходит на webhook.
