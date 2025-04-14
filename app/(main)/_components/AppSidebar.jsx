"use client"
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarOptions } from '@/services/Constants';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const AppSidebar = ({hide, changeHide}) => {
    const path = usePathname();
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarHeader className={'relative flex items-center mt-2'}>
                <SidebarTrigger onClick={()=> changeHide(true)} className='right-2 top-0 absolute cursor-pointer hover:bg-gray-100 p-2 rounded-full'/>
                <div className='flex items-center my-2 mt-5'>
                    <Image src={'/logo.png'} alt='logo'
                        width={40} height={40}
                    />
                    <h1 className='font-bold flex items-center text-sky-400 z-10 text-2xl relative'>
                        AI
                        <span className='absolute left-[20%] text-sky-300/80 text-4xl items-center z-0'>R</span>
                        <span className='text-black z-10 ml-0.5'>ecruiter</span>
                    </h1>
                </div>

                <Button className='w-full mt-5' onClick={()=> router.push('/dashboard/create-interview')}><Plus /> Create New Interview</Button>
            </SidebarHeader>
            <SidebarContent className='mt-5'>
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            SidebarOptions.map((option, index) => (
                                <SidebarMenuItem key={index} className='p-1'>
                                    <SidebarMenuButton asChild className={`p-5 ${path === option.path && 'bg-blue-50 text-primary hover:text-primary hover:bg-blue-100' }`}>
                                        <Link href={option.path}>
                                            <option.icon />
                                            <span className='text-[16px] font-medium'>{option.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    );
};

export default AppSidebar;