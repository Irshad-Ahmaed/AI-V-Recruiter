import Image from 'next/image';
import React from 'react';

const InterviewHeader = () => {
  return (
    <div className='p-4 shadow-sm'>
      <div className='flex'>
        <Image src={'/logo.png'} alt='logo' width={100} height={100} className='size-10' />
        <h1 className='font-bold flex items-center text-sky-400 z-10 text-2xl relative'>
          AI
          <span className='absolute left-[20%] text-sky-300/80 text-4xl items-center z-0'>R</span>
          <span className='text-black z-10 ml-0.5'>ecruiter</span>
        </h1>
      </div>
    </div>
  );
};

export default InterviewHeader;