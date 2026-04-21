export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    return new Response(JSON.stringify({ ok: true, payload }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = () =>
  new Response(JSON.stringify({ ok: true, msg: 'RoverScript API' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
