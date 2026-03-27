// src/features/auth/components/RegisterForm.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/features/auth/hooks/useRegister';
import {
  registerSchema,
  toRegisterRequestDto,
  type RegisterFormValues,
} from '@/features/auth/schemas/auth.schema';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';

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
      'Register failed. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Register failed. Please try again.';
};

const RegisterForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const isBusy = useMemo(() => {
    return isSubmitting || registerMutation.isPending;
  }, [isSubmitting, registerMutation.isPending]);

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(true);
  };

  const handleHideConfirmPassword = () => {
    setShowConfirmPassword(false);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      const payload = toRegisterRequestDto(values);
      const response = await registerMutation.mutateAsync(payload);

      if (!response.success || !response.data?.token) {
        setServerError(
          response.message || 'Register failed. Please try again.'
        );
        return;
      }

      tokenStorage.setToken(response.data.token);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me,
      });

      router.replace('/timeline');
    } catch (error) {
      setServerError(getServerErrorMessage(error));
    }
  };

  return (
    <div className='relative z-10 w-full max-w-[clamp(24rem,94vw,32.6875rem)] rounded-[1.75rem] border border-white/10 bg-black/35 px-6 py-8 shadow-[0_0_0_0.0625rem_rgba(255,255,255,0.02)] backdrop-blur-xl sm:px-6 sm:py-9'>
      <div className='flex flex-col items-center'>
        <SocialityMark />

        <h1 className='mt-9 text-center text-[clamp(1.5rem,3.8vw,1.875rem)] font-semibold leading-[clamp(2.25rem,4.8vw,2.5rem)] text-white'>
          Register
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='mt-10' noValidate>
        <div>
          <label
            htmlFor='name'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Name
          </label>

          <Input
            id='name'
            type='text'
            placeholder='Enter your name'
            autoComplete='name'
            hasError={Boolean(errors.name)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            {...register('name')}
          />

          {errors.name ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className='mt-[1.625rem]'>
          <label
            htmlFor='username'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Username
          </label>

          <Input
            id='username'
            type='text'
            placeholder='Enter your username'
            autoComplete='username'
            hasError={Boolean(errors.username)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            {...register('username')}
          />

          {errors.username ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div className='mt-[1.625rem]'>
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
            htmlFor='phone'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Number Phone
          </label>

          <Input
            id='phone'
            type='tel'
            placeholder='Enter your phone number'
            autoComplete='tel'
            hasError={Boolean(errors.phone)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            {...register('phone')}
          />

          {errors.phone ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.phone.message}
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
            autoComplete='new-password'
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

        <div className='mt-[1.625rem]'>
          <label
            htmlFor='confirmPassword'
            className='type-text-md mb-3 block font-semibold text-white'
          >
            Confirm Password
          </label>

          <Input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Re-enter your password'
            autoComplete='new-password'
            hasError={Boolean(errors.confirmPassword)}
            className='h-12 rounded-[0.875rem] border-white/10 bg-white/[0.04] text-white placeholder:text-white/30'
            endAdornment={
              <button
                type='button'
                aria-label='Press and hold to show confirm password'
                aria-pressed={showConfirmPassword}
                onMouseDown={handleShowConfirmPassword}
                onMouseUp={handleHideConfirmPassword}
                onMouseLeave={handleHideConfirmPassword}
                onTouchStart={handleShowConfirmPassword}
                onTouchEnd={handleHideConfirmPassword}
                onBlur={handleHideConfirmPassword}
                className='inline-flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none'
              >
                <Eye className='size-[1.125rem]' />
              </button>
            }
            {...register('confirmPassword')}
          />

          {errors.confirmPassword ? (
            <p className='type-text-sm mt-2 font-medium text-destructive'>
              {errors.confirmPassword.message}
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
          {isBusy ? 'Registering...' : 'Register'}
        </Button>

        <p className='type-text-md mt-5 text-center font-semibold text-white'>
          Already have an account?{' '}
          <Link
            href='/auth/login'
            className='text-primary transition-opacity hover:opacity-90'
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
