"use client";
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabase-client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import JobDetailsContainer from '../_components/JobDetails';

const InterviewDetails = () => {
  const { interview_id } = useParams();
  const {user} = useUser();

  useEffect(()=>{
    user && GetInterviewDetail();
  }, [user]);
  
  const GetInterviewDetail = async () => {
    try {
      if (!user) {
        toast.error("Please Login to continue");
        return;
      }
      const { data: InterviewData, error: InterviewError } = await supabase.from('Job Postings')
        .select("*, Interview-feedback(*)").eq('userEmail', user.email).eq('interviewId', interview_id);

      if (InterviewError) {
        console.log('Error while fetching interview details', InterviewError);
        toast.error("Can't find the interview details");
        return;
      }
      console.log(InterviewData);
    } catch (error) {
      console.log("Error while getting interview detail", error);
    }
  };

  return (
    <div className='mt-5'>
      <div>
        <h2 className='text-xl font-bold'>Interview Details</h2>
      </div>

      <div>
        <JobDetailsContainer/>
      </div>

      <div>Candidate</div>
    </div>
  );
};

export default InterviewDetails;