export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'world';

    const apiBase = process.env.API_INTERNAL_URL || 'http://demo-api:8010';
    const upstream = `${apiBase}/hello?name=${encodeURIComponent(name)}`;

    const res = await fetch(upstream, { cache: 'no-store' });
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
