// src/features/profile/components/EditProfileCta.tsx

import Link from 'next/link';
import { ArrowRight, PencilLine } from 'lucide-react';

type EditProfileCtaProps = Readonly<{
  compact?: boolean;
}>;

const EditProfileCta = ({ compact = false }: EditProfileCtaProps) => {
  if (compact) {
    return (
      <Link
        href='/profile/edit'
        className='inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-border bg-card px-4 text-card-foreground transition-colors hover:bg-muted'
        aria-label='Edit profile'
      >
        <PencilLine className='size-5' aria-hidden='true' />
      </Link>
    );
  }

  return (
    <Link
      href='/profile/edit'
      className='inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted'
    >
      <span>Edit Profile</span>
      <ArrowRight className='size-4' aria-hidden='true' />
    </Link>
  );
};

export default EditProfileCta;
