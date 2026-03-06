// src/app/(platform)/inquiry/page.tsx
"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitInquiry } from "@/actions/inquiryActions";
import { CheckCircle2, Send } from "lucide-react";

export default function InquiryPage() {
  const { t } = useLanguage();
  const a = t.platform.agency;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await submitInquiry({
      type: "general",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      content: [
        `[기관유형] ${formData.get("org_type")}`,
        `[예산] ${formData.get("budget")}`,
        `[프로젝트 설명]`,
        formData.get("message") as string,
      ].join("\n"),
    });

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif mb-4">{a.inquiry_success}</h2>
          <a
            href="/"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-border rounded-sm hover:bg-muted transition-colors"
          >
            ← Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground animate-fade-in">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto">
          <span className="text-sm font-mono text-muted-foreground block mb-6">{a.inquiry_label}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight whitespace-pre-line mb-6">
            {a.inquiry_title}
          </h1>
          <p className="text-xl font-light text-foreground/70 max-w-2xl">
            {a.inquiry_desc}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-screen-md mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-3">
                  {a.inquiry_name} <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-border focus:border-foreground outline-none transition-colors text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-3">
                  {a.inquiry_email} <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-border focus:border-foreground outline-none transition-colors text-lg"
                />
              </div>
            </div>

            {/* Phone & Org Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-3">
                  {a.inquiry_phone}
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-border focus:border-foreground outline-none transition-colors text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-3">
                  {a.inquiry_org_type}
                </label>
                <select
                  name="org_type"
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-border focus:border-foreground outline-none transition-colors text-lg"
                >
                  <option value="">{a.inquiry_org_other}</option>
                  <option value="gallery">{a.inquiry_org_gallery}</option>
                  <option value="artist">{a.inquiry_org_artist}</option>
                  <option value="organization">{a.inquiry_org_org}</option>
                  <option value="education">{a.inquiry_org_edu}</option>
                  <option value="other">{a.inquiry_org_other}</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-4">
                {a.inquiry_budget}
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "under50", label: a.inquiry_budget_under50 },
                  { value: "50-100", label: a.inquiry_budget_50_100 },
                  { value: "100-300", label: a.inquiry_budget_100_300 },
                  { value: "300-500", label: a.inquiry_budget_300_500 },
                  { value: "over500", label: a.inquiry_budget_over500 },
                  { value: "undecided", label: a.inquiry_budget_undecided },
                ].map((opt) => (
                  <label key={opt.value} className="cursor-pointer">
                    <input type="radio" name="budget" value={opt.value} className="peer sr-only" />
                    <span className="block px-5 py-3 border border-border rounded-full text-sm peer-checked:bg-foreground peer-checked:text-background peer-checked:border-foreground transition-all hover:border-foreground/50">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-3">
                {a.inquiry_message} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder={a.inquiry_message_placeholder}
                className="w-full px-4 py-4 bg-transparent border-2 border-border rounded-lg focus:border-foreground outline-none transition-colors text-lg resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-5 bg-foreground text-background text-lg font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? a.inquiry_submitting : a.inquiry_submit}
              <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
