'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [handles, setHandles] = useState({ instagram: '', youtube: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleNext = () => setStep(step + 1);

  const startMagic = () => {
    setIsGenerating(true);
    // Mocking AI & Theme extraction
    setTimeout(() => {
      router.push('/admin'); // Redirect to editor after magic
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/5 animate-ping rounded-full"></div>
                <Loader2 className="w-12 h-12 animate-spin text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">Magic in progress</h2>
                <p className="text-gray-400 text-sm font-medium">Analyzing photo colors & generating AI branding...</p>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Step 01</div>
                <h1 className="text-4xl font-black tracking-tightest">당신의 프로필<br />사진을 올려주세요.</h1>
              </div>
              
              <div 
                onClick={() => setPhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2')}
                className="bw-border h-64 rounded-[40px] flex flex-col items-center justify-center gap-4 bg-gray-50 border-dashed hover:border-black cursor-pointer transition-all overflow-hidden group"
              >
                {photo ? (
                  <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-gray-200 group-hover:text-black transition-colors" />
                    <span className="text-xs font-bold text-gray-400">Click to Upload</span>
                  </>
                )}
              </div>

              <button 
                onClick={handleNext}
                disabled={!photo}
                className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-20 translate-y-0 active:scale-95 transition-all"
              >
                Next Step <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Step 02</div>
                <h1 className="text-4xl font-black tracking-tightest">SNS 계정을<br />연결할까요?</h1>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-5 bw-border rounded-3xl bg-gray-50 focus-within:border-black transition-colors">
                  <Camera className="text-gray-300" />
                  <input 
                    type="text" 
                    placeholder="Instagram Handle" 
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    onChange={(e) => setHandles({ ...handles, instagram: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4 p-5 bw-border rounded-3xl bg-gray-50 focus-within:border-black transition-colors">
                  <Video className="text-gray-300" />
                  <input 
                    type="text" 
                    placeholder="YouTube Channel URL" 
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    onChange={(e) => setHandles({ ...handles, youtube: e.target.value })}
                  />
                </div>
              </div>

              <button 
                onClick={startMagic}
                className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles size={18} /> Generate My Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
