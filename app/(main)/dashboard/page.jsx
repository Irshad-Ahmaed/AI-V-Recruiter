import React from 'react';
import CreateOptions from './_components/CreateOptions';
import LatestInterviewsLists from './_components/LatestInterviewsLists';

const Dashboard = () => {
  return (
    <div>
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreateOptions/>

      <LatestInterviewsLists/>
    </div>
  );
};

export default Dashboard;