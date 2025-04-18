"use client";
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext } from 'react';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);

    return (
        <div className='p-20 lg:px-48 xl:px-56 h-screen'>
            <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
                <span className='flex gap-2 items-center'>
                    <Timer className='size-4' />
                    00:00:00
                </span>
            </h2>

            <div className='grid gap-7 grid-cols-1 md:grid-cols-2 mt-5'>
                <div className='bg-white p-20 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                    <Image src={'/interviewr_logo.jpg'} alt='interviewer_image' width={100} height={100} className='w-[80px] h-[80px] shadow rounded-full' />
                    <h2>AI Recruiter</h2>
                    {/* Wave effect */}
                    <div className='flex mt-4'>
                        {/* <span className='wave-bar'></span>
                        <span className='wave-bar'></span>
                        <span className='wave-bar'></span> */}
                    </div>
                </div>
                <div className='bg-white p-20 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                    <Image src={'/user.png'} alt='interviewer_image' width={100} height={100} className='w-[80px] h-[80px] shadow rounded-full' />
                    <h2>{interviewInfo?.userName || ""}</h2>
                    {/* Wave effect */}
                    <div className='flex mt-4'>
                        {/* <span className='wave-bar'></span>
                        <span className='wave-bar'></span>
                        <span className='wave-bar'></span> */}
                    </div>
                </div>
            </div>

            <div className='flex gap-5 items-center justify-center mt-7'>
                <Mic className='size-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer hover:scale-105 hover:shadow transition-all duration-300' />
                <Phone className='size-12 p-3 bg-red-500 text-white rounded-full cursor-pointer hover:scale-105 hover:shadow transition-all duration-300' />
            </div>
            <h2 className='text-sm text-muted-foreground text-center mt-5'>Interview is in Progress...</h2>
        </div>
    );
};

export default StartInterview;