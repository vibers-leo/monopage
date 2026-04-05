'use client';

import React, { useState } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { LinkCard } from '@/components/LinkCard';
import { Plus, Save, Settings, Link as LinkIcon, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [profile, setProfile] = useState({
    username: 'alex_kim',
    bio: 'Digital nomad & UI Designer. Exploring the world one pixel at a time.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    links: [
      { id: 1, title: 'My Design Portfolio', url: 'https://behance.net' },
      { id: 2, title: 'Hire Me on Dribbble', url: 'https://dribbble.com' }
    ]
  });

  const updateBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({ ...profile, bio: e.target.value });
  };

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden font-sans">
      {/* Editor Sidebar */}
      <aside className="w-[400px] border-r border-gray-100 flex flex-col p-8 bg-white z-10">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-gray-300 hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-black text-xs uppercase tracking-[0.3em]">Editor</h1>
          <Settings size={18} className="text-gray-300" />
        </div>
        
        <div className="flex flex-col gap-10 flex-1 overflow-y-auto">
          <section>
            <label className="block text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest">Bio & About</label>
            <textarea 
              value={profile.bio} 
              onChange={updateBio}
              className="w-full min-h-[120px] p-4 text-sm font-medium border border-gray-100 rounded-2xl focus:border-black outline-none transition-colors resize-none leading-relaxed"
              placeholder="Tell your story..."
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Links</label>
              <button className="flex items-center gap-1 text-[10px] font-black text-black hover:opacity-50 transition-opacity uppercase tracking-widest">
                <Plus size={12} /> Add Link
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {profile.links.map(link => (
                <div key={link.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <LinkIcon size={14} className="text-gray-300" />
                    <span className="text-xs font-bold">{link.title}</span>
                  </div>
                  <Settings size={12} className="text-gray-200" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest">SNS Accounts</label>
            <button className="w-full py-4 border border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors">
              Connect New Account
            </button>
          </section>
        </div>

        <div className="pt-8 border-t border-gray-50 mt-auto">
          <button className="w-full py-4 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </aside>

      {/* Live Preview Pane */}
      <main className="flex-1 bg-gray-50 flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-[375px] h-[768px] bg-white border-[8px] border-black rounded-[50px] shadow-2xl relative overflow-y-auto scrollbar-hide">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
          
          <div className="px-8 py-20 flex flex-col items-center">
            <div className="inline-block px-3 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest mb-10">
              Live Preview
            </div>
            
            <ProfileHeader 
              username={profile.username} 
              bio={profile.bio} 
              avatarUrl={profile.avatar_url} 
            />

            <div className="w-full">
              {profile.links.map((link: any) => (
                <LinkCard key={link.id} title={link.title} url={link.url} className="px-4 py-4" />
              ))}
            </div>

            <div className="mt-12 opacity-10 text-[8px] font-black uppercase tracking-widest text-center">
              Preview Mode
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
