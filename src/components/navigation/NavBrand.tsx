// src/components/navigation/NavBrand.tsx

import Image from 'next/image';
import Link from 'next/link';

type NavBrandProps = Readonly<{
  showWordmark?: boolean;
  href?: string;
}>;

const NavBrand = ({
  showWordmark = true,
  href = '/',
}: NavBrandProps) => {
  return (
    <Link
      href={href}
      className='inline-flex items-center gap-3 rounded-full text-foreground transition-opacity hover:opacity-90'
      aria-label='Sociality'
    >
      <Image
        src='/assets/logo/sociality-logo.svg'
        alt=''
        width={34}
        height={34}
        className='h-[2.125rem] w-[2.125rem] shrink-0'
      />

      {showWordmark ? (
        <span className='type-display-xs font-semibold leading-none tracking-[-0.02em] text-foreground'>
          Sociality
        </span>
      ) : null}
    </Link>
  );
};

export default NavBrand;
