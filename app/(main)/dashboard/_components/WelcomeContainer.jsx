"use client";
import { useUser } from '@/app/provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/services/supabase-client';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

const WelcomeContainer = () => {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      return;
    }
    setUser(null); // clear context
    toast.success('Logout successfully');
  };

  return (
    <div className='w-full flex items-center justify-between bg-white p-5 rounded-xl'>
      <div className=''>
        <h2 className='font-bold text-lg'>Welcome back, <span className='text-primary'>{user?.userName}</span></h2>
        <h2 className='text-muted-foreground'>AI Driven Interviews, Hassel-free Hiring</h2>
      </div>
      {/* You Need To Configure Next.mjs file for images */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative group w-10 p-5 md:p-0 h-10 rounded-full cursor-pointer overflow-hidden">
            <Image
              src={user?.picture || '/user.png'}
              alt='user_img'
              fill
              className="object-cover rounded-full"
            />
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-glow" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem onClick={handleLogout} className='cursor-pointer text-red-500'>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WelcomeContainer;