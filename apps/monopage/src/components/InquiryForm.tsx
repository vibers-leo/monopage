'use client';

import React, { useState, useId } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { createInquiry } from '@/lib/api';
import type { Theme } from '@/lib/themes';

interface InquiryFormProps {
  profileId: number;
  username: string;
  theme?: Theme;
  ctaText?: string;
  title?: string;
}

export function InquiryForm({ profileId, username, theme, ctaText, title }: InquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const t = theme?.vars;
  const uid = useId();
  const cls = `iq-${uid.replace(/:/g, '')}`;

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('이름을 입력해주세요'); return; }
    if (!form.email.trim() && !form.phone.trim()) { setError('이메일 또는 연락처를 입력해주세요'); return; }
    if (!form.message.trim()) { setError('문의 내용을 입력해주세요'); return; }

    setSubmitting(true);
    setError('');
    try {
      await createInquiry({ profile_id: profileId, username, ...form });
      setDone(true);
    } catch (e: any) {
      setError(e.message || '문의를 보내지 못했어요');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className="w-full py-10 flex flex-col items-center gap-3 text-center rounded-2xl"
        style={{ backgroundColor: t?.cardBg || '#f5f5f5' }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: t?.bg || '#ffffff' }}>
          <Check size={20} style={{ color: t?.text || '#0a0a0a' }} />
        </div>
        <p className="text-[16px] font-bold" style={{ color: t?.text || '#0a0a0a' }}>문의를 보냈어요</p>
        <p className="text-[15px]" style={{ color: t?.textMuted || '#a3a3a3' }}>확인 후 연락드릴게요</p>
      </div>
    );
  }

  const inputCls = `${cls}-input w-full py-3.5 px-4 rounded-xl text-[15px] font-medium outline-none transition-colors`;
  const inputStyle: React.CSSProperties = {
    backgroundColor: t?.cardBg || '#f5f5f5',
    border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
    color: t?.text || '#0a0a0a',
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <style dangerouslySetInnerHTML={{ __html: `.${cls}-input::placeholder { color: ${t?.textMuted || '#a3a3a3'}; opacity: 0.7; }` }} />

      <div className="flex items-center justify-between mb-1">
        <p className="text-[16px] font-bold" style={{ color: t?.text || '#0a0a0a' }}>{title || '문의하기'}</p>
        <p className="text-[13px]" style={{ color: t?.textMuted || '#a3a3a3' }}>* 필수</p>
      </div>

      <input
        type="text"
        placeholder="이름 *"
        className={inputCls}
        style={inputStyle}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="이메일 *"
        className={inputCls}
        style={inputStyle}
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="tel"
        placeholder="연락처 (이메일 입력 시 선택)"
        className={inputCls}
        style={inputStyle}
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <textarea
        placeholder="문의 내용 *"
        rows={4}
        className={`${inputCls} resize-none leading-relaxed`}
        style={inputStyle}
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />

      {error && <p className="text-[14px] text-red-400 font-medium">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting || !form.name.trim() || !form.message.trim() || (!form.email.trim() && !form.phone.trim())}
        className="w-full py-4 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-30 active:scale-[0.98]"
        style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> {ctaText || '문의 보내기'}</>}
      </button>

      <p className="text-[13px] text-center" style={{ color: t?.textMuted || '#a3a3a3' }}>
        이메일 또는 연락처 중 1개는 필수예요
      </p>
    </div>
  );
}
