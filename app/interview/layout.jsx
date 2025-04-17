import React from 'react';
import InterviewHeader from './_components/InterviewHeader';

const InterviewLayout = ({ children }) => {

  return (
    <div className='bg-secondary pb-6'>
      <InterviewHeader />
      {children}
    </div>
  );
};

export default InterviewLayout;