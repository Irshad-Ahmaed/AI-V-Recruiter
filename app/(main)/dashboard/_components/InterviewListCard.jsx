"use client";
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase-client';
import { ArrowRight, Clock, Copy, Send } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const InterviewListCard = ({ interview }) => {
    const router = useRouter();
    const [expireStatus, setExpireStatus] = useState('');

    const url = process.env.NEXT_PUBLIC_HOST_URL + interview?.interviewId;
    const copyLink = () => {
        navigator.clipboard.writeText(url);
        toast('Link copied');
    };

    const onSend = () => {
        const subject = encodeURIComponent("Interview Invitation");
        const body = encodeURIComponent(`Hi Candidate,\n\nYou have been invited to an interview. Please use the following link to join:\n\n${process.env.NEXT_PUBLIC_HOST_URL + interview?.interviewId}\n\n please use the same email when start your interview \n\n\n Best regards,`);

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    useEffect(() => {
        const checkExpiration = async () => {
            const isExpired = new Date(interview?.Valid_till) < new Date();
            if (isExpired && interview?.Link_Expired === false) {
                await supabase
                    .from('Job Postings')
                    .update({ Link_Expired: true })
                    .eq("interviewId", interview?.interviewId);
                setExpireStatus('Expired');
            } else {
                setExpireStatus(`Exp on: ${moment(interview?.Valid_till).format("MMM Do YY")}`);
            }
        };

        checkExpiration();
    }, [interview]);


    return (
        <div className='relative p-5 bg-white rounded-lg border space-y-2'>
            <>
                <div className='flex items-center justify-between'>
                    <div className='size-[25px] lg:size-[40px] bg-primary rounded-full'></div>
                    <h2 className='text-sm'>{expireStatus}</h2>
                </div>

                <div className='flex gap-0 items-center justify-between'>
                    <h2 className='font-bold text-primary text-sm lg:text-xl'>{interview?.companyName}</h2>
                    <h2 className='font-bold text-sm lg:text-l'>{interview?.jobPosition}</h2>
                </div>
                <div className='flex items-center justify-between gap-2 text-muted-foreground'>
                    <p className='flex gap-2 items-center text-sm lg:text-sm'><Clock className='size-3 mt-0.5 lg:size-4' /> {interview?.duration} </p>
                    <span className={`text-sm lg:text-sm z-10 ${interview['Interview-feedback']?.length > 0 ? 'text-green-500' : 'text-primary'}`}>{interview['Interview-feedback']?.length} Candidate</span>
                </div>

                <div className='grid grid-cols-2 gap-3 mt-5 items-center'>
                    <Button variant={'outline'}
                        className={'flex items-center gap-2 text-xs lg:text-sm'}
                        onClick={() => copyLink()}
                    >
                        <Copy className='size-3 lg:size-4' />Copy Link
                    </Button>
                    <Button className={'flex items-center gap-2 text-xs lg:text-sm'} onClick={() => onSend()}>
                        <Send className='size-3 lg:size-4' />Send
                    </Button>
                </div>
            </>
            <div onClick={() => router.push(`/interview-details/${interview?.interviewId}`)} className='absolute hover:shadow-md top-[41%] hover:z-20 -right-5 text-white bg-gray-200 p-3 rounded-full hover:bg-primary 
                cursor-pointer transition-colors duration-300'>
                <ArrowRight className='size-5' />
            </div>
        </div>
    );
};

export default InterviewListCard;