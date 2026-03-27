// src/features/auth/components/LoginForm.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/features/auth/hooks/useLogin';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth.schema';

type ApiErrorEnvelope = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

const SocialityMark = () => {
  return (
    <div className='flex items-center justify-center gap-3 text-white'>
      <Image
        src='/assets/logo/sociality-logo.svg'
        alt='Sociality logo'
        width={30}
        height={30}
        className='h-7 w-7 shrink-0'
        priority
      />

      <span className='text-[clamp(1.5rem,2.4vw,1.75rem)] font-semibold leading-none tracking-tight text-white'>
        Sociality
      </span>
    </div>
  );
};

const getServerErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorEnvelope>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      'Login failed. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Login failed. Please try again.';
};

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const isBusy = useMemo(() => {
    return isSubmitting || loginMutation.isPending;
  }, [isSubmitting, loginMutation.isPending]);

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await loginMutation.mutateAsync(values);

      if (!response.success) {
        setServerError(response.message || 'Login failed. Please try again.');
        return;
      }

      router.replace('/timeline');
    } catch (error) {
      setServerError(getServerErrorMessage(error));
    }
  };

  return (
    <div className='relative z-10 w-full max-w-[clamp(22rem,92vw,27.875rem)] rounded-[1.75rem] border border-white/10 bg-black/35 px-6 py-8 shadow-[0_0_0_0.0625rem_rgba(255,255,255,0.02)] backdrop-blur-xl sm:px-6 sm:py-9'>
      <div className='flex flex-col items-center'>
        <SocialityMark />

        <h1 className='mt-9 text-center text-[clamp(1.5rem,3.8vw,1.875rem)] font-semibold leading-[clamp(2.25rem,4.8vw,2.5rem)] text-white'>
          Welcome Back!
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='mt-10' noValidate>
        <div>
          <label
            htmlFor='email'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Email
          </label>

          <Input
            id='email'
            type='email'
            placeholder='Enter your email'
            autoComplete='email'
            hasError={Boolean(errors.email)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            {...register('email')}
          />

          {errors.email ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className='mt-[1.625rem]'>
          <label
            htmlFor='password'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Password
          </label>

          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            autoComplete='current-password'
            hasError={Boolean(errors.password)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            endAdornment={
              <button
                type='button'
                aria-label='Press and hold to show password'
                aria-pressed={showPassword}
                onMouseDown={handleShowPassword}
                onMouseUp={handleHidePassword}
                onMouseLeave={handleHidePassword}
                onTouchStart={handleShowPassword}
                onTouchEnd={handleHidePassword}
                onBlur={handleHidePassword}
                className='inline-flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none'
              >
                <Eye className='size-[1.125rem]' />
              </button>
            }
            {...register('password')}
          />

          {errors.password ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {serverError ? (
          <div className='mt-5 rounded-2xl border border-destructive/35 bg-destructive/10 px-4 py-3'>
            <p className='type-text-sm font-medium text-destructive'>
              {serverError}
            </p>
          </div>
        ) : null}

        <Button
          type='submit'
          size='lg'
          disabled={isBusy}
          className='mt-5 w-full border-0 bg-primary text-primary-foreground shadow-[0_1.125rem_3.125rem_rgba(105,54,242,0.30)] hover:bg-primary/90'
        >
          {isBusy ? 'Logging in...' : 'Login'}
        </Button>

        <p className='type-text-md mt-5 text-center font-semibold text-white'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/register'
            className='text-primary transition-opacity hover:opacity-90'
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
