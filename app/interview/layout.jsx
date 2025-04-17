"use client"
import React, { useEffect } from 'react'
import InterviewHeader from './_components/InterviewHeader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '../provider';

const InterviewLayout = ({children}) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("Please Login");
      router.push('/auth');
    }
  }, [user]);
  
  return (
    <div className='bg-secondary pb-6'>
        <InterviewHeader/>
        {children}
    </div>
  )
}

export default InterviewLayout