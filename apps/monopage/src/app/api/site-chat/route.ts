import { NextRequest, NextResponse } from 'next/server';

const ZEROCLAW_URL = process.env.ZEROCLAW_URL || 'http://172.17.0.1:42618';
const ZEROCLAW_TOKEN = process.env.ZEROCLAW_TOKEN || '';
const BACKEND_URL = process.env.BACKEND_URL || 'http://49.50.138.93:4110';

export async function POST(req: NextRequest) {
  try {
    const { message, username } = await req.json();

    if (!message || !username) {
      return NextResponse.json({ error: 'message and username are required' }, { status: 400 });
    }

    // 해당 프로필의 knowledge_md 조회
    const profileRes = await fetch(`${BACKEND_URL}/api/v1/profiles/${username}`);
    if (!profileRes.ok) {
      return NextResponse.json({ error: '페이지를 찾을 수 없어요' }, { status: 404 });
    }
    const profile = await profileRes.json();
    const knowledge = profile.knowledge_md;

    if (!knowledge || knowledge.trim().length === 0) {
      return NextResponse.json({ error: 'AI 도우미가 설정되지 않았어요' }, { status: 404 });
    }

    const systemPrompt = `너는 "${profile.username}" 페이지의 AI 도우미야.
아래 Knowledge Base 정보만을 기반으로 정확하게 답변해.
답변은 2-3문장으로 짧게, 한국어로, 친근하게 해줘.
중요: 이 채팅은 AI 자동 응답이며 실제 담당자에게 메시지가 전달되지 않아.
Knowledge Base에 없는 내용이나 직접 상담이 필요한 경우 반드시 "더 자세한 내용은 아래 '문의하기' 버튼을 눌러 문의폼으로 남겨주세요!" 라고 안내해.
예약, 주문, 개인정보 관련 요청도 문의폼을 안내해.

=== Knowledge Base ===
${knowledge}
=== End ===`;

    const res = await fetch(`${ZEROCLAW_URL}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZEROCLAW_TOKEN}`,
      },
      body: JSON.stringify({ message: `[SYSTEM INSTRUCTION] ${systemPrompt}\n\n[USER] ${message}` }),
    });

    if (!res.ok) {
      return NextResponse.json({ response: '지금은 AI 도우미가 응답할 수 없어요. 문의폼으로 직접 물어봐주세요!' });
    }

    const data = await res.json();
    return NextResponse.json({ response: data.response });
  } catch {
    return NextResponse.json({ response: '문제가 생겼어요. 문의폼으로 직접 물어봐주세요!' });
  }
}
