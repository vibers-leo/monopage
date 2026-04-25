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

  try {
    const apiUrl = process.env.RAILS_API_URL || 'http://monopage-api:80';
    const res = await fetch(`${apiUrl}/api/v1/profiles/${username}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const profile = await res.json();
      return {
        title: `@${profile.username} | Monopage`,
        description: profile.bio || `@${profile.username}의 모노페이지`,
        openGraph: {
          title: `@${profile.username} | Monopage`,
          description: profile.bio || `@${profile.username}의 모노페이지`,
          images: profile.avatar_url ? [profile.avatar_url] : [],
          type: 'profile',
        },
        twitter: {
          card: 'summary',
          title: `@${profile.username} | Monopage`,
          description: profile.bio || `@${profile.username}의 모노페이지`,
          images: profile.avatar_url ? [profile.avatar_url] : [],
        },
      };
    }
  } catch { /* fallback */ }

  return {
    title: `@${username} | Monopage`,
    description: `@${username}의 모노페이지`,
  };
}

import { ProfileView } from '@/components/ProfileView';

export default async function PublicProfilePage({ params }: Props) {
  const username = (await params).username;
  return <ProfileView username={username} />;
}
