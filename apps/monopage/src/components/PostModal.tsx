'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Calendar } from 'lucide-react';

interface PostModalProps {
  post: any;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-5xl rounded-[32px] overflow-hidden flex flex-col md:flex-row h-full max-h-[800px] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Section */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center relative group min-h-[300px]">
            {post.media_type === 'VIDEO' ? (
              <video 
                src={post.media_url} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src={post.media_url} 
                alt={post.caption} 
                className="w-full h-full object-contain"
              />
            )}
            
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-[380px] p-8 md:p-10 flex flex-col bg-white border-l border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Calendar size={12} />
                <span>Just now</span>
              </div>
              <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${post.media_type === 'VIDEO' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                {post.media_type}
              </div>
            </div>

            <p className="text-sm font-medium leading-relaxed text-gray-800 mb-auto italic">
              "{post.caption || 'No caption provided.'}"
            </p>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <a 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all group"
              >
                <span className="text-xs font-bold">View on Original SNS</span>
                <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
