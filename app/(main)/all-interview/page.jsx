"use client";
import React, { useEffect, useState } from 'react';
import InterviewListCard from '../dashboard/_components/InterviewListCard';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/provider';
import { toast } from 'sonner';
import { supabase } from '@/services/supabase-client';

const AllInterview = () => {
    const [interviewList, setInterviewList] = useState([]);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        try {
            if (!user) {
                toast.error("Please Login to continue");
                return;
            }
            const { data: InterviewData, error: InterviewError } = await supabase.from('Job Postings')
                .select("created_at, companyName, jobPosition, duration, Interview-feedback(userEmail)").eq('userEmail', user.email).order('id', { ascending: false });

            if (InterviewError) {
                console.log('Error while fetching interviews', InterviewError);
                toast.error("Can't find the interviews");
                return;
            }
            console.log(InterviewData);
            setInterviewList(InterviewData);
        } catch (error) {
            console.log("Error while getting interview", error);
        }
    };

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>All Previously Created Interviews</h2>

            {
                interviewList?.length === 0 ? (
                    <div className='flex flex-col gap-3 p-5 items-center bg-white rounded-lg mt-5'>
                        <Video className='size-10 text-primary' />
                        <h2>You don't have any created Interview!</h2>
                        <Button className='cursor-pointer' onClick={() => router.push('/dashboard/create-interview')}>+ Create New Interview</Button>
                    </div>
                )
                    :
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-3 gap-5'>
                        {interviewList.map((interview, index) => (
                            <InterviewListCard key={index} interview={interview} />
                        ))}
                    </div>
            }
        </div>
    );
};

export default AllInterview;