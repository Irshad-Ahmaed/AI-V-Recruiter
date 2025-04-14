import { Phone, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const CreateOptions = () => {
  return (
    <div className='grid grid-cols-2 gap-5'>
      <Link href={'/dashboard/create-interview'} className='bg-white shadow-sm rounded-lg p-5 hover:bg-gray-50 cursor-pointer'>
        <VideoIcon className='p-3 text-primary bg-blue-50 rounded-lg size-12'/>
        <h2 className='font-bold mt-2'>Create New Interview</h2>
        <p className='text-muted-foreground'>Create AI Interview and schedule with Candidates</p>
      </Link>

      <Link href={'/'} className='bg-white shadow-sm rounded-lg p-5 hover:bg-gray-50 cursor-pointe'>
        <Phone className='p-3 text-primary bg-blue-50 rounded-lg size-12'/>
        <h2 className='font-bold mt-2'>Create Phone Screening Call</h2>
        <p className='text-muted-foreground'>schedule Phone call screening with Candidates</p>
      </Link>
    </div>
  )
}

export default CreateOptions