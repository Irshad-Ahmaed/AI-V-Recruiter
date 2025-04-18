"use client";
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LatestInterviewsLists = () => {
  const [interviewList, setInterviewList] = useState([]);
  const router = useRouter();

  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>

      {
        interviewList?.length === 0 && (
          <div className='flex flex-col gap-3 p-5 items-center bg-white rounded-lg mt-5'>
            <Video className='size-10 text-primary' />
            <h2>You don't have any created Interview!</h2>
            <Button className='cursor-pointer' onClick={()=> router.push('/dashboard/create-interview')}>+ Create New Interview</Button>
          </div>
        )
      }
    </div>
  );
};

export default LatestInterviewsLists;