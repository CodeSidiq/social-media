// src/app/(public)/auth/layout.tsx

import AuthPublicOnlyGate from '@/components/auth/AuthPublicOnlyGate';

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <AuthPublicOnlyGate>
      <main className='relative min-h-screen overflow-hidden bg-black text-white'>
        <div className='absolute inset-0 bg-black' />

        <div className='absolute inset-x-[-12%] bottom-[-28%] h-[72%] bg-[radial-gradient(ellipse_at_42%_100%,rgba(127,81,249,0.95)_0%,rgba(127,81,249,0.58)_26%,rgba(127,81,249,0.26)_48%,rgba(127,81,249,0.12)_62%,transparent_82%)] blur-3xl sm:inset-x-[-10%] sm:bottom-[-30%] sm:h-[78%]' />

        <div className='absolute left-[-14%] top-[42%] h-[34rem] w-[34rem] rounded-full bg-primary/22 blur-[140px] sm:left-[-10%] sm:top-[40%] sm:h-[40rem] sm:w-[40rem]' />

        <div className='absolute right-[-16%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-primary/18 blur-[140px] sm:right-[-12%] sm:top-[28%] sm:h-[38rem] sm:w-[38rem]' />

        <div className='absolute inset-x-0 bottom-[-8%] h-[28%] bg-[linear-gradient(180deg,rgba(127,81,249,0)_0%,rgba(127,81,249,0.08)_38%,rgba(127,81,249,0.16)_100%)] blur-2xl' />

        <section className='relative mx-auto flex min-h-screen w-full items-center justify-center px-8 py-10 sm:px-6 sm:py-12'>
          {children}
        </section>
      </main>
    </AuthPublicOnlyGate>
  );
};

export default AuthLayout;
