'use client';

import React, { useState } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { createInquiry } from '@/lib/api';
import type { Theme } from '@/lib/themes';

interface InquiryFormProps {
  profileId: number;
  username: string;
  theme?: Theme;
}

export function InquiryForm({ profileId, username, theme }: InquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const t = theme?.vars;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      setError('이름과 문의 내용을 입력해주세요');
      return;
    }
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
      <div className="w-full py-8 flex flex-col items-center gap-3 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: t?.cardBg || '#f5f5f5' }}
        >
          <Check size={20} style={{ color: t?.text || '#0a0a0a' }} />
        </div>
        <p className="text-[16px] font-bold" style={{ color: t?.text || '#0a0a0a' }}>문의를 보냈어요</p>
        <p className="text-[14px]" style={{ color: t?.textMuted || '#a3a3a3' }}>
          확인 후 연락드릴게요
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-[16px] font-bold" style={{ color: t?.text || '#0a0a0a' }}>문의하기</p>

      <input
        type="text"
        placeholder="이름"
        className="w-full py-3 px-4 rounded-xl text-[15px] font-medium outline-none transition-colors"
        style={{
          backgroundColor: t?.cardBg || '#f5f5f5',
          border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
          color: t?.text || '#0a0a0a',
        }}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="이메일 (선택)"
          className="flex-1 py-3 px-4 rounded-xl text-[15px] font-medium outline-none transition-colors"
          style={{
            backgroundColor: t?.cardBg || '#f5f5f5',
            border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
            color: t?.text || '#0a0a0a',
          }}
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="연락처 (선택)"
          className="flex-1 py-3 px-4 rounded-xl text-[15px] font-medium outline-none transition-colors"
          style={{
            backgroundColor: t?.cardBg || '#f5f5f5',
            border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
            color: t?.text || '#0a0a0a',
          }}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <textarea
        placeholder="문의 내용을 입력해주세요"
        rows={3}
        className="w-full py-3 px-4 rounded-xl text-[15px] font-medium outline-none resize-none transition-colors leading-relaxed"
        style={{
          backgroundColor: t?.cardBg || '#f5f5f5',
          border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
          color: t?.text || '#0a0a0a',
        }}
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />

      {error && <p className="text-[14px] text-red-500 font-medium">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting || !form.name.trim() || !form.message.trim()}
        className="w-full py-3.5 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
        style={{
          backgroundColor: t?.text || '#0a0a0a',
          color: t?.bg || '#ffffff',
        }}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> 문의 보내기</>}
      </button>
    </div>
  );
}
