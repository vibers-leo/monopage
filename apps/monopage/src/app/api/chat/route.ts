import { NextRequest, NextResponse } from 'next/server';

const ZEROCLAW_URL = process.env.ZEROCLAW_URL || 'http://172.17.0.1:42618';
const ZEROCLAW_TOKEN = process.env.ZEROCLAW_TOKEN || 'zc_de636b3d09ca4ad2e186d4813561321f45a0588e42bb468820b5f56815e90bef';

const SYSTEM_PROMPT = `너는 모노페이지(monopage.kr) 고객 안내 챗봇이야.
모노페이지는 링크만 붙여넣으면 나만의 1페이지 웹사이트가 만들어지는 서비스야.
핵심 가치: 팔로워 없음, 좋아요 없음 — 오직 비즈니스에 집중.
답변은 2-3문장으로 짧게, 한국어로, 친근하게 해줘.
웹검색이나 도구를 사용하지 말고 네가 아는 정보로만 직접 답변해.
모르는 건 "관리자에게 직접 문의해주세요"라고 안내해.`;

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
      body: JSON.stringify({ message: `[SYSTEM INSTRUCTION] ${SYSTEM_PROMPT}\n\n[USER] ${message}` }),
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
