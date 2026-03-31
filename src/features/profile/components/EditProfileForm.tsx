// src/features/profile/components/EditProfileForm.tsx

'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, ImagePlus, RotateCcw } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import {
  editProfileSchema,
  type EditProfileFormValues,
} from '@/features/profile/schemas/edit-profile.schema';
import type { MyProfileViewModel } from '@/features/profile/types/profile.types';

type EditProfileFormProps = Readonly<{
  profile: MyProfileViewModel;
}>;

const BIO_MAX_LENGTH = 280;

const getDefaultValues = (
  profile: MyProfileViewModel
): EditProfileFormValues => ({
  name: profile.name,
  username: profile.username,
  phone: profile.phone,
  bio: profile.bio,
  avatar: undefined,
});

const EditProfileForm = ({ profile }: EditProfileFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues(profile),
  });

  const bioValue = useWatch({
    control,
    name: 'bio',
    defaultValue: profile.bio,
  });

  useEffect(() => {
    reset(getDefaultValues(profile));
  }, [profile, reset]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const displayAvatarSrc = useMemo(() => {
    return avatarPreviewUrl || profile.avatarUrl || null;
  }, [avatarPreviewUrl, profile.avatarUrl]);

  const bioCharacterCount = bioValue.length;

  const clearAvatarPreview = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarPreviewUrl(null);
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const selectedFile = event.target.files?.[0];

    clearAvatarPreview();

    if (!selectedFile) {
      setValue('avatar', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);

    setAvatarPreviewUrl(nextPreviewUrl);
    setValue('avatar', selectedFile, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setFormNotice(null);
  };

  const handleResetChanges = () => {
    reset(getDefaultValues(profile));
    clearAvatarPreview();
    setFormNotice(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('username', values.username);
      formData.append('phone', values.phone);
      formData.append('bio', values.bio);

      if (values.avatar) {
        formData.append('avatar', values.avatar);
      }

      const updatedProfile = await mutateAsync(formData);

      reset(getDefaultValues(updatedProfile));
      clearAvatarPreview();
      setFormNotice('Profile updated successfully.');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update profile.';
      setFormNotice(message);
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className='space-y-6 md:space-y-8'
      noValidate
    >
      <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-4 md:gap-5'>
            <div className='relative size-24 overflow-hidden rounded-full border border-border bg-muted md:size-28'>
              {displayAvatarSrc ? (
                <Image
                  src={displayAvatarSrc}
                  alt={`${profile.name} avatar preview`}
                  fill
                  sizes='112px'
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                  <Camera className='size-8' aria-hidden='true' />
                </div>
              )}
            </div>

            <div className='space-y-3'>
              <div className='space-y-1'>
                <h2 className='text-base font-semibold text-card-foreground md:text-lg'>
                  Profile photo
                </h2>
                <p className='text-sm leading-7 text-muted-foreground'>
                  Upload PNG, JPG, or WEBP up to 5MB.
                </p>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  onClick={handleAvatarButtonClick}
                  className='inline-flex items-center gap-2'
                >
                  <ImagePlus className='size-4' aria-hidden='true' />
                  <span>Change Photo</span>
                </Button>

                {avatarPreviewUrl ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='lg'
                    onClick={handleResetChanges}
                    className='inline-flex items-center gap-2'
                  >
                    <RotateCcw className='size-4' aria-hidden='true' />
                    <span>Reset Preview</span>
                  </Button>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/png,image/jpeg,image/webp'
                className='hidden'
                onChange={handleAvatarChange}
              />

              {errors.avatar ? (
                <p className='text-sm text-destructive'>
                  {errors.avatar.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <label
              htmlFor='edit-profile-name'
              className='text-sm font-medium text-card-foreground'
            >
              Name
            </label>
            <Input
              id='edit-profile-name'
              placeholder='Enter your name'
              autoComplete='name'
              hasError={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name ? (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            ) : null}
          </div>

          <div className='grid gap-2'>
            <label
              htmlFor='edit-profile-username'
              className='text-sm font-medium text-card-foreground'
            >
              Username
            </label>
            <Input
              id='edit-profile-username'
              placeholder='Enter your username'
              autoComplete='username'
              hasError={Boolean(errors.username)}
              {...register('username')}
            />
            {errors.username ? (
              <p className='text-sm text-destructive'>
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div className='grid gap-2'>
            <label
              htmlFor='edit-profile-phone'
              className='text-sm font-medium text-card-foreground'
            >
              Phone
            </label>
            <Input
              id='edit-profile-phone'
              placeholder='Enter your phone number'
              autoComplete='tel'
              hasError={Boolean(errors.phone)}
              {...register('phone')}
            />
            {errors.phone ? (
              <p className='text-sm text-destructive'>{errors.phone.message}</p>
            ) : null}
          </div>

          <div className='grid gap-2'>
            <label
              htmlFor='edit-profile-bio'
              className='text-sm font-medium text-card-foreground'
            >
              Bio
            </label>
            <Textarea
              id='edit-profile-bio'
              rows={5}
              resize='vertical'
              placeholder='Write a short bio'
              hasError={Boolean(errors.bio)}
              {...register('bio')}
            />

            <div className='flex items-start justify-between gap-4'>
              {errors.bio ? (
                <p className='text-sm text-destructive'>{errors.bio.message}</p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Keep it short, clear, and relevant.
                </p>
              )}

              <span className='text-sm text-muted-foreground'>
                {bioCharacterCount}/{BIO_MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-[1.75rem] border border-dashed border-border bg-card p-6 md:p-8'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-base font-semibold text-card-foreground'>
              Submission status
            </h3>
            <p className='text-sm leading-7 text-muted-foreground'>
              Your profile changes will be submitted to the authenticated self-profile endpoint.
            </p>
          </div>

          {formNotice ? (
            <p className='text-sm text-muted-foreground'>{formNotice}</p>
          ) : null}

          <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              size='lg'
              onClick={handleResetChanges}
              disabled={isPending}
            >
              Reset Changes
            </Button>

            <Button type='submit' size='lg' disabled={!isDirty || !isValid || isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default EditProfileForm;
