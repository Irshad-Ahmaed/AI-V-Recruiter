"use client"
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SidebarOptions } from '@/services/Constants';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const AppSidebar = () => {
    const path = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className={'flex items-center mt-5'}>
                <div className='flex items-center'>
                    <Image src={'/logo.png'} alt='logo'
                        width={40} height={40}
                    />
                    <h1 className='font-bold flex items-center text-sky-400 z-10 text-2xl relative'>
                        AI
                        <span className='absolute left-[20%] text-sky-300/80 text-4xl items-center z-0'>R</span>
                        <span className='text-black z-10 ml-0.5'>ecruiter</span>
                    </h1>
                </div>

                <Button className='w-full mt-5'><Plus /> Create New Interview</Button>
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