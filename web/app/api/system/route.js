export async function GET() {
  try {
    const apiBase = process.env.API_INTERNAL_URL || 'http://backend-api:8010';
    const res = await fetch(`${apiBase}/system`, { cache: 'no-store' });
    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    return Response.json(
      { error: 'Upstream request failed', details: String(error?.message || error) },
      { status: 502 },
    );
  }
}
