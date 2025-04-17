"use client";
import React, { useEffect } from 'react';
import DashboardProvider from './provide';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';
import { useUser } from '../provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      if (!user) {
        toast.error("Please Login");
        router.push('/auth');
      }
    };
    checkUser();

    return ()=> checkUser;
  }, [user]);

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