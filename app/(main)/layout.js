"use client";
import React, { useEffect } from 'react';
import DashboardProvider from './provide';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';
import { useUser } from '../provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';

const DashboardLayout = ({ children }) => {
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
    <div className='bg-secondary'>
      <DashboardProvider>
        <div className='px-10 py-5'>
          <WelcomeContainer />
          {children}
        </div>
      </DashboardProvider>
    </div>
  );
};

export default DashboardLayout;