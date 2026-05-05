/**
 * HubSpot Forms API (submissions v3) — отправка лида с сайта в форму HubSpot.
 * Документация: https://developers.hubspot.com/docs/api/marketing/forms
 *
 * Соответствие полей CRM (Contact):
 * - email      → стандартное свойство Email (`email`)
 * - firstname  → First name (`firstname`)
 * - phone      → Phone number (`phone`) — основной телефон контакта
 * - car_model  → кастомное свойство; в коде поле формы по умолчанию `car_model`
 *
 * В HubSpot: Settings → Data Management → Objects → Contacts → Properties —
 * у кастомного поля «модель авто» должен быть internal name `car_model`, ЛИБО
 * задайте HUBSPOT_FIELD_CAR_MODEL под ваше имя. То же имя должно быть у поля
 * на самой форме (Marketing → Forms → ваша форма → поля из свойств контакта).
 */

const SUBMIT_BASE = 'https://api.hsforms.com/submissions/v3/integration/submit';

function getPortalId() {
  const raw = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || process.env.HUBSPOT_PORTAL_ID;
  if (raw === '') return null;
  return (raw || '148417505').trim();
}

function getFormGuid() {
  const g = process.env.HUBSPOT_FORM_GUID;
  return typeof g === 'string' ? g.trim() : '';
}

/** Имена полей в теле запроса Forms API = internal names свойств / полей формы. */
export function getHubSpotFieldNames() {
  return {
    email: (process.env.HUBSPOT_FIELD_EMAIL || 'email').trim(),
    firstname: (process.env.HUBSPOT_FIELD_FIRSTNAME || 'firstname').trim(),
    phone: (process.env.HUBSPOT_FIELD_PHONE || 'phone').trim(),
    carModel: (process.env.HUBSPOT_FIELD_CAR_MODEL || 'car_model').trim(),
  };
}

/**
 * Отправка данных в HubSpot через Forms API.
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.firstname
 * @param {string} params.phone
 * @param {string} [params.carModel] — попадает в CRM как кастомное поле (по умолчанию `car_model`)
 * @param {object} [params.context] — pageUri, pageName, hutk (cookie HubSpot для атрибуции)
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string, details?: unknown }>}
 */
export async function submitHubSpotBookingForm(params) {
  const portalId = getPortalId();
  const formGuid = getFormGuid();
  const names = getHubSpotFieldNames();

  if (!portalId) {
    return { ok: false, status: 503, message: 'HubSpot portal ID is not configured.' };
  }
  if (!formGuid) {
    return { ok: false, status: 503, message: 'HUBSPOT_FORM_GUID is not set.' };
  }

  const email = String(params.email ?? '').trim();
  const firstname = String(params.firstname ?? '').trim();
  const phone = String(params.phone ?? '').trim();
  const carModel = String(params.carModel ?? '').trim();

  const fields = [];
  const push = (name, value) => {
    if (name && value !== '') fields.push({ name, value });
  };

  push(names.email, email);
  push(names.firstname, firstname);
  push(names.phone, phone);
  push(names.carModel, carModel);

  const ctx = params.context && typeof params.context === 'object' ? params.context : {};
  const context = {
    ...(ctx.pageUri && { pageUri: String(ctx.pageUri).slice(0, 2048) }),
    ...(ctx.pageName && { pageName: String(ctx.pageName).slice(0, 512) }),
    ...(ctx.hutk && { hutk: String(ctx.hutk).slice(0, 256) }),
  };

  const url = `${SUBMIT_BASE}/${encodeURIComponent(portalId)}/${encodeURIComponent(formGuid)}`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields,
        ...(Object.keys(context).length > 0 ? { context } : {}),
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[hubspot]', message);
    return { ok: false, status: 502, message: 'HubSpot request failed.', details: message };
  }

  const raw = await res.text();
  let details;
  try {
    details = raw ? JSON.parse(raw) : undefined;
  } catch {
    details = raw;
  }

  if (!res.ok) {
    console.error('[hubspot]', res.status, raw.slice(0, 800));
    const msg =
      details && typeof details === 'object' && details.message
        ? String(details.message)
        : `HubSpot returned ${res.status}`;
    return { ok: false, status: res.status, message: msg, details };
  }

  return { ok: true };
}
