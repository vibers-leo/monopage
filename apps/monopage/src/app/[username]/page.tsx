import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = (await params).username;
  
  // In a real app, you would fetch profile data from API here.
  // Using mock data for demo:
  const profile = {
    username: username,
    bio: 'Creating digital experiences at the intersection of art and code. 🚀',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  };

  return {
    title: `${profile.username} (@${profile.username}) | Monopage`,
    description: profile.bio,
    openGraph: {
      title: `${profile.username} - Monopage Profile`,
      description: profile.bio,
      images: [profile.avatar_url],
      type: 'profile',
      username: profile.username
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.username} | Monopage`,
      description: profile.bio,
      images: [profile.avatar_url],
    }
  };
}

import { ProfileView } from '@/components/ProfileView';

export default async function PublicProfilePage({ params }: Props) {
  const username = (await params).username;
  return <ProfileView username={username} />;
}
