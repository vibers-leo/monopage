'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  username: string;
  bio: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, bio, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center gap-6 mb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full border border-gray-200 p-1 bg-white"
      >
        <div 
          className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-3xl font-extrabold text-gray-400 bg-cover bg-center"
          style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}
        >
          {!avatarUrl && username[0].toUpperCase()}
        </div>
      </motion.div>
      
      <div className="flex flex-col items-center gap-2">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-black tracking-tight"
        >
          @{username}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm max-w-xs text-center font-medium leading-relaxed"
        >
          {bio}
        </motion.p>
      </div>
    </div>
  );
};
