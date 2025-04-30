"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useUser } from '../provider';

const HeaderComponent = () => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
    }, [user, loading, router]);

    return (
        <div className='py-4 px-5 md:px-20 flex justify-between items-center bg-blue-50'>
            <div className='flex'>
                <Image src={'/logo.png'} alt='logo' width={100} height={100} className='size-10' />
                <h1 className='font-bold flex items-center text-sky-400 z-10 text-2xl relative'>
                    AI
                    <span className='absolute left-[20%] text-sky-300/80 text-4xl items-center z-0'>R</span>
                    <span className='text-black z-10 ml-0.5'>ecruiter</span>
                </h1>
            </div>

            <div>
                {!user ?
                    <Button variant={'outline'} className={'w-20'} onClick={() => router.push('/auth')}>Login</Button>
                    :
                    <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
                }
            </div>
        </div>
    );
};

export default HeaderComponent;