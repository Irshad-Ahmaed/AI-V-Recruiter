import React from 'react'
import DashboardProvider from './provide';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';

const DashboardLayout = ({children}) => {
  return (
    <div className='bg-secondary'>
        <DashboardProvider>
            <div className='px-10 py-5'>
              <WelcomeContainer/>
              {children}
            </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout