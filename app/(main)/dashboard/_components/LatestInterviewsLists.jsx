"use client";
import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase-client';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InterviewListCard from './InterviewListCard';

const LatestInterviewsLists = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      if (!user) {
        toast.error("Please Login to continue");
        return;
      }
      const { data: InterviewData, error: InterviewError } = await supabase.from('Job Postings')
        .select("created_at, companyName, jobPosition, duration, interviewId, Valid_till, Link_Expired, Interview-feedback(userEmail)").eq('userEmail', user.email).order('id', { ascending: false }).limit(3);

      if (InterviewError) {
        console.log('Error while fetching interviews', InterviewError);
        toast.error("Can't find the interviews");
        return;
      }
      console.log(InterviewData);
      setInterviewList(InterviewData);
    } catch (error) {
      console.log("Error while getting interview", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>

      {
        interviewList?.length === 0 ? (
          <div className='flex flex-col gap-3 p-5 items-center bg-white rounded-lg mt-5'>
            <Video className='size-10 text-primary' />
            <h2>You don't have any created Interview!</h2>
            <Button className='cursor-pointer' onClick={() => router.push('/dashboard/create-interview')}>+ Create New Interview</Button>
          </div>
        )
          :
          <div className='relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-3 gap-7'>
            {!loading && interviewList.map((interview, index) => (
              <InterviewListCard key={index} interview={interview} />
            ))}

            {
              loading && [...Array(3)].map((_, index) => (
                <div className="space-y-4">
                  <div className="w-full h-44 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))
            }

            {interviewList?.length > 3 &&
              <span className='absolute -top-5 right-0 text-muted-foreground text-sm cursor-pointer 
            hover:underline w-fit'
                onClick={() => router.push('/all-interview')}
              >
                Show more
              </span>
            }
          </div>
      }
    </div>
  );
};

export default LatestInterviewsLists;