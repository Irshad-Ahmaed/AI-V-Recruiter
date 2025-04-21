import { Check, Clock, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const InterviewCompleted = () => {
  return (
    <div className='px-10 md:px-28 lg:px-40 xl:px-56 pt-6'>
      <div className='flex flex-col items-center gap-5'>
        <div className='p-3 bg-green-500 rounded-full'>
          <Check className='size-8 font-bold'/>
        </div>
        <h2 className='font-bold text-3xl'>Interview Complete!</h2>
        <p className='text-muted-foreground'>Thank you for participating in the AI-driven interview with AiRecruiter</p>
        <Image src={'/interview_ss.webp'} alt='interview_complete' width={700} height={500} 
          className='w-[700px] rounded-2xl h-[200px] object-cover'
        />

        <div className='flex flex-col shadow items-center justify-center rounded-xl px-2 py-4 gap-2 md:gap-5 w-[250px] md:w-1/2'>
          <div className='bg-primary text-white p-2 rounded-full'>
            <Send className='size-5'/>
          </div>
          <h2 className='font-bold text-xl md:text-2xl'>What's Next?</h2>
          <p className='text-muted-foreground text-xs md:text-sm text-center'>The recruiter will review your interview responses and will contact you 
            soon regarding the next steps.
          </p>

          <span className='flex items-center gap-2 text-xs md:text-sm text-muted-foreground'><Clock className='size-4'/> Response within 2-3 business days</span>
        </div>
      </div>
    </div>
  )
}

export default InterviewCompleted