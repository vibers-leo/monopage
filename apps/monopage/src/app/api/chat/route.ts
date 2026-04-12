import { NextRequest, NextResponse } from 'next/server';

const ZEROCLAW_URL = process.env.ZEROCLAW_URL || 'http://172.17.0.1:42618';
const ZEROCLAW_TOKEN = process.env.ZEROCLAW_TOKEN || 'zc_de636b3d09ca4ad2e186d4813561321f45a0588e42bb468820b5f56815e90bef';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const res = await fetch(`${ZEROCLAW_URL}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZEROCLAW_TOKEN}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ response: data.response });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
