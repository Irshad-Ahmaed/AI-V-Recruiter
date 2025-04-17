"use client";

import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase-client';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

const Login = () => {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle= async()=>{
    try {
      setLoading(true);
      const {error} = await supabase.auth.signInWithOAuth({
        provider:'google',
        options:{
          redirectTo: `${process.env.NEXT_PUBLIC_DEPLOYED_URL}/dashboard`
        }
      });

      if(error){
        console.log('Error:', error.message);
        toast.error(error.message);
      };
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col items-center gap-2 shadow-md border rounded-2xl p-8'>
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

        <div className='text-center flex items-center flex-col'>
          <Image src={'/login.jpg'} alt='login' width={400} height={300} className='rounded-2xl'/>
          <h2 className='text-2xl font-bold mt-5'>Welcome To AIRecruiter</h2>
          <p className='text-gray-500'>Sign In With Google</p>

          <Button className={'w-full mt-5 cursor-pointer transition-all duration-500 flex items-center justify-center'} variant={hover ? 'outline' : ''} 
            onMouseOver={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}
            onClick={signInWithGoogle}
          > 
            {loading && <Loader2Icon size={18} className='animate-spin mt-0.5 duration-300'/>}
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;