import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PostModal } from './PostModal';

interface Post {
  id: string;
  media_url: string;
  permalink: string;
  media_type: string;
  caption?: string;
}

interface SnsGalleryProps {
  posts: Post[];
  className?: string;
}

export function SnsGallery({ posts, className }: SnsGalleryProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-12", className)}>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedPost(post)}
            className={cn(
              "relative aspect-square rounded-3xl overflow-hidden bg-gray-50 cursor-pointer group",
              index === 0 && "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
            )}
          >
            <img 
              src={post.media_url} 
              alt={post.caption || 'SNS Post'} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <motion.div whileHover={{ scale: 1.2 }}>
                  {post.media_type === 'VIDEO' ? '▶' : '+'}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
