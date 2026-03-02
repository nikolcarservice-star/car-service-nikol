# Мониторинг цен с интернета (Познань и окрестности)

Скрипт загружает актуальные цены с сайта **KB.pl** (cenniki warsztatów w Poznaniu, Szamotułach i okolicach) и отдаёт их в формате JSON для CRM Nikol.

## Вариант 1: Раз в неделю запускать на ПК

1. Установите Node.js (nodejs.org), если ещё нет.
2. В папке `price-monitor` выполните:
   ```bash
   node run.js > prices.json
   ```
3. В CRM: **Настройки → Мониторинг цен** → кнопка **«Загрузить JSON»** → выберите `prices.json`.

Можно настроить **Планировщик заданий** (Windows) или **cron** (Linux/Mac), чтобы `node run.js > prices.json` выполнялся раз в неделю.

## Вариант 2: Развернуть на Vercel (мониторинг «с интернета» одной кнопкой)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com) (бесплатно).
2. Установите Vercel CLI: `npm i -g vercel`.
3. В папке `price-monitor` выполните:
   ```bash
   vercel
   ```
4. Скопируйте выданный URL, например: `https://nikol-price-monitor-xxx.vercel.app`.
5. В CRM: **Настройки → Мониторинг цен** → в поле URL вставьте:  
   `https://ваш-проект.vercel.app/api/prices`
6. Нажмите **«Мониторить с интернета (Познань)»** — цены подтянутся с KB.pl автоматически.

Раз в неделю (или когда нужно) нажимайте эту кнопку — данные берутся с сайта KB.pl (Познань, Szamotuły i okolice).

## Источники данных

- [KB.pl — Cennik warsztatów Poznań](https://kb.pl/cenniki/miejskie/warsztat-samochodowy/poznan/)
- [KB.pl — Cennik warsztatów Szamotuły](https://kb.pl/cenniki/miejskie/warsztat-samochodowy/szamotuly/)

Формат ответа для CRM: массив объектов `[{ "id": "1", "basePrice": 100, "competitorAvgPrice": 120 }, ...]` по id услуг 1–5.
