// src/components/feedback/FeedStateCard.tsx
import { Button } from '@/components/ui/button'; type FeedStateCardProps = Readonly<{ title: string; description: string; actionLabel?: string; onAction?: () => void;
}>; const FeedStateCard = ({ title, description, actionLabel, onAction,
}: FeedStateCardProps) => { return ( <section className='mx-auto w-full max-w-[42.75rem] py-2 sm:py-4'> <div className='px-1 py-6 sm:px-0 sm:py-8'> <h1 className='text-lg text-foreground'>{title}</h1> <p className='mt-2 max-w-[32rem] text-sm leading-7 text-muted-foreground'> {description} </p> {actionLabel && onAction ? ( <Button type='button' variant='outline' onClick={onAction} className='mt-5 h-11 px-5' > {actionLabel} </Button> ) : null} </div> </section> );
}; export default FeedStateCard;
