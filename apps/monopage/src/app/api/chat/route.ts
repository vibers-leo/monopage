import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const ZEROCLAW_URL = process.env.ZEROCLAW_URL || 'http://172.17.0.1:42618';
const ZEROCLAW_TOKEN = process.env.ZEROCLAW_TOKEN || 'zc_de636b3d09ca4ad2e186d4813561321f45a0588e42bb468820b5f56815e90bef';

// knowledge/base.md 를 빌드 시점에 읽어서 포함
let knowledgeBase = '';
try {
  knowledgeBase = readFileSync(join(process.cwd(), 'knowledge', 'base.md'), 'utf-8');
} catch {
  knowledgeBase = '모노페이지는 링크를 붙여넣으면 1페이지 웹사이트를 만드는 서비스입니다.';
}

const SYSTEM_PROMPT = `너는 모노페이지(monopage.kr) 고객 안내 챗봇이야.
아래 Knowledge Base 정보를 기반으로 정확하게 답변해.
답변은 2-3문장으로 짧게, 한국어로, 친근하게 해줘.
웹검색이나 도구를 절대 사용하지 말고, 아래 정보로만 답변해.
Knowledge Base에 없는 내용은 "관리자에게 직접 문의해주세요"라고 안내해.

=== Knowledge Base ===
${knowledgeBase}
=== End ===`;

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
