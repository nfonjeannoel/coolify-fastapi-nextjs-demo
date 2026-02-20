export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = (body?.prompt || '').trim();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiBase = process.env.API_INTERNAL_URL || 'http://backend-api:8010';
    const upstream = `${apiBase}/generate`;

    const res = await fetch(upstream, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
      cache: 'no-store'
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    return Response.json(
      { error: 'Upstream request failed', details: String(error?.message || error) },
      { status: 502 }
    );
  }
}
