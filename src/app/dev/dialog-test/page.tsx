'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const DialogTestPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-neutral-950 p-6'>
      <Dialog>
        <DialogTrigger asChild>
          <Button type='button'>Open Dialog</Button>
        </DialogTrigger>

        <DialogContent className='max-w-lg p-6 bg-neutral-900 text-neutral-100'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>
                Ini test untuk memastikan dialog bekerja dengan benar.
              </DialogDescription>
            </div>

            <input
              type='text'
              placeholder='Ketik sesuatu...'
              className='w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-200'
            />

            <Button type='button'>Action</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogTestPage;
