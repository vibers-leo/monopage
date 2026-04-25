import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

const ADMIN_EMAIL = 'vibers.leo@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    let subject = '[Monopage] 알림';
    let html = '';

    if (type === 'page_request') {
      subject = `[Monopage] 추가 페이지 개설 신청 — ${data.username}`;
      html = `
        <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
          <div style="background:#7c3aed;color:#fff;padding:24px;">
            <h1 style="margin:0;font-size:16px;font-weight:700;">추가 페이지 개설 신청</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 12px;font-size:15px;"><strong>희망 주소:</strong> monopage.kr/${data.username}</p>
            <p style="margin:0 0 12px;font-size:15px;"><strong>용도:</strong> ${data.purpose || '미입력'}</p>
            <p style="margin:0 0 12px;font-size:15px;"><strong>연락처:</strong> ${data.email}</p>
            <a href="https://monopage.kr/admin-console" style="display:inline-block;padding:12px 24px;background:#0a0a0a;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;margin-top:8px;">관리자 대시보드</a>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Monopage <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ ok: true }); // 사용자에게는 성공 반환
  }
}
