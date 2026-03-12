# Деплой CRM на car-service-nikol-crm.vercel.app

Чтобы новая CRM 1.1 открывалась по адресу **https://car-service-nikol-crm.vercel.app/** (с корня, без `/crm`):

1. В Vercel проект **car-service-nikol-crm** должен быть подключён к **этому же репозиторию** (не к отдельной папке admin).

2. В настройках проекта → **Environment Variables** добавьте:
   - **Name:** `NEXT_PUBLIC_CRM_BASE_PATH`
   - **Value:** оставьте пустым (не пишите ничего)
   - Применить для Production, Preview, Development.

3. Задеплойте проект (push в main или ручной Redeploy).

После этого:
- **car-service-nikol-crm.vercel.app/** — открывает CRM (логин, рабочий стол).
- **car-service-nikol-crm.vercel.app/orders** — список заказов и т.д.

На основном сайте CRM по-прежнему доступна по пути **/crm**.
