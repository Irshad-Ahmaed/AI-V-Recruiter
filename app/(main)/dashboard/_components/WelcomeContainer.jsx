"use client";
import { useUser } from '@/app/provider';
import Image from 'next/image';
import React from 'react'

const WelcomeContainer = () => {
  const {user} = useUser();

  return (
    <div className='w-full flex items-center justify-between bg-white p-5 rounded-xl'>
      <div className=''>
        <h2 className='font-bold text-lg'>Welcome back, <span className='text-primary'>{user?.name}</span></h2>
        <h2 className='text-muted-foreground'>AI Driven Interviews, Hassel-free Hiring</h2>
      </div>
      {/* You Need To Configure Next.mjs file for images */}
      <Image src={user?.picture} alt='user_img' width={40} height={40} className='rounded-full'/>
    </div>
  )
}

export default WelcomeContainer