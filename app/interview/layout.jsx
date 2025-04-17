"use client";
import React, { useEffect } from 'react';
import InterviewHeader from './_components/InterviewHeader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '../provider';
import { Loader2Icon } from 'lucide-react';

const InterviewLayout = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please Login");
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-10"><Loader2Icon className='size-4 space-x-2 animate-spin' /> Loading...</div>;
  }

  return (
    <div className='bg-secondary pb-6'>
      <InterviewHeader />
      {children}
    </div>
  );
};

export default InterviewLayout;