import { submitHubSpotBookingForm } from '../../../lib/hubspotFormSubmit';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clamp(s, max) {
  const t = String(s ?? '').trim();
  return t.length > max ? t.slice(0, max) : t;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const email = clamp(body.email, 254);
  const firstname = clamp(body.firstname, 120);
  const phone = clamp(body.phone, 40);
  const carModel = clamp(body.carModel ?? body.car_model, 200);
  const pageUri = clamp(body.pageUri, 2048);

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Valid email is required.' }, { status: 400 });
  }
  if (!firstname) {
    return Response.json({ error: 'First name is required.' }, { status: 400 });
  }
  if (!phone) {
    return Response.json({ error: 'Phone is required.' }, { status: 400 });
  }

  const hutk = request.cookies.get('hubspotutk')?.value;

  const result = await submitHubSpotBookingForm({
    email,
    firstname,
    phone,
    carModel,
    context: {
      ...(pageUri && { pageUri }),
      pageName: 'Car Service Nikol — booking',
      ...(hutk && { hutk }),
    },
  });

  if (!result.ok) {
    const status = result.status >= 400 && result.status < 600 ? result.status : 502;
    return Response.json(
      {
        error: result.message || 'Submission failed.',
        ...(process.env.NODE_ENV === 'development' && result.details ? { details: result.details } : {}),
      },
      { status }
    );
  }

  return Response.json({ ok: true });
}
