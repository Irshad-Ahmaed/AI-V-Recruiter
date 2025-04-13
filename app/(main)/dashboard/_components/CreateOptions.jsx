import { Phone, VideoIcon } from 'lucide-react';
import React from 'react'

const CreateOptions = () => {
  return (
    <div className='grid grid-cols-2 gap-5'>
      <div className='bg-white shadow-lg rounded-lg p-5'>
        <VideoIcon className='p-3 text-primary bg-blue-50 rounded-lg size-12'/>
        <h2 className='font-bold mt-2'>Create New Interview</h2>
        <p className='text-muted-foreground'>Create AI Interview and schedule with Candidates</p>
      </div>

      <div className='bg-white shadow-lg rounded-lg p-5'>
        <Phone className='p-3 text-primary bg-blue-50 rounded-lg size-12'/>
        <h2 className='font-bold mt-2'>Create Phone Screening Call</h2>
        <p className='text-muted-foreground'>schedule Phone call screening with Candidates</p>
      </div>
    </div>
  )
}

export default CreateOptions