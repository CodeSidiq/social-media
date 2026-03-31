// src/app/users/[username]/page.tsx

import PublicProfilePageClient from '@/features/public-profile/components/PublicProfilePageClient';

type PublicProfilePageProps = Readonly<{
  params: Promise<{
    username: string;
  }>;
}>;

const PublicProfilePage = async ({ params }: PublicProfilePageProps) => {
  const { username } = await params;

  return <PublicProfilePageClient username={username} />;
};

export default PublicProfilePage;
