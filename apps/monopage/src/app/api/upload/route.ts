import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_URL || 'http://49.50.138.93:4110';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization') || '';
    const formData = await request.formData();
    const res = await fetch(`${API_URL}/api/v1/upload`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData,
    });

    if (!res.ok) {
      return NextResponse.json({ error: '파일을 올리지 못했어요. 다시 시도해볼게요.' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '파일을 올리지 못했어요. 잠시 후 다시 시도해볼게요.' }, { status: 500 });
  }
}
