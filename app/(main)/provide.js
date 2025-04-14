"use client";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { useState } from 'react';
import AppSidebar from './_components/AppSidebar';

const DashboardProvider = ({ children }) => {
    const [hide, setHide] = useState(false);

    return (
        <SidebarProvider>
            {!hide && <AppSidebar hide={hide} changeHide={setHide}/>}
            <div className='w-full'>
                {hide && <SidebarTrigger onClick={()=> setHide(!hide)} className='cursor-pointer hover:bg-gray-100 p-2 rounded-full'/>}
                {children}
            </div>
        </SidebarProvider>
    );
};

export default DashboardProvider;