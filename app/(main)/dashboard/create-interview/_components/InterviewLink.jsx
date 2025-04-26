import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, Linkedin, List, Mail, Phone, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const InterviewLink = ({ interviewId, formData }) => {
  const router = useRouter();
  const [text, setText] = useState('Linkedin');

  const url = process.env.NEXT_PUBLIC_HOST_URL + interviewId;
  const getInterviewURL = () => {
    return url;
  };

  const expiresAt = () => {
    const futureDate = new Date(new Date(formData?.created_at || '2025-04-14 19:09:50.492361+00').getTime() + 30 * 24 * 60 * 60 * 1000);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = futureDate.toLocaleDateString('en-US', options);

    return formattedDate;
  };


  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast('Link copied');
  };

  const shareJobPost = (platform) => {
    const { companyName, jobPosition, jobDescription } = formData;

    const formattedPost =
      `🚀 **Job Opportunity at ${companyName}!**

      📌 **Position:** ${jobPosition}

      📝 **Description:**  
      ${jobDescription}
    `;

    navigator.clipboard.writeText(formattedPost);
    toast('job position copied ');

    setText('Redirecting to linkedin...');

    setTimeout(() => {
      switch (platform) {
        case 'linkedin':
          window.open('https://www.linkedin.com/sharing/share-offsite/', '_blank');
          break;

        default:
          break;
      }
      setText('Linkedin');
    }, 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(process.env.NEXT_PUBLIC_HOST_URL + interviewId);

    switch (platform) {
      case 'email':
        const subject = encodeURIComponent("Interview Invitation");
        const body = encodeURIComponent(`Hi,\n\nYou have been invited to an interview. Please use the following link to join:\n\n${process.env.NEXT_PUBLIC_HOST_URL + interviewId}\n\nBest regards,`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        break;

      case 'linkedin':
        window.open(`https://www.linkedin.com/messaging/`, '_blank');
        break;

      case 'whatsapp':
        window.open(`https://wa.me/?text=${url}`, '_blank');
        break;

      default:
        break;
    }
  };


  return (
    <div className='flex flex-col items-center justify-center space-y-10'>
      <div className='flex flex-col items-center'>
        <Image src={'/tick.png'} alt='success_icon' width={200} height={200} className='size-[50px]' />
        <h2 className='font-bold text-center text-lg mt-4'>Your AI Interview is Ready!</h2>
        <p className='mt-3 text-center text-muted-foreground'>Share this link with candidates to start the interview process</p>
      </div>

      <div className='bg-white shadow rounded-lg p-7 w-full'>
        <div className='flex items-center justify-between'>
          <h2 className='font-bold'>Interview Link</h2>
          <h2 className='text-primary bg-blue-50 rounded-xl text-sm px-2 py-1'>Valid for 30 days</h2>
        </div>
        <div className='flex items-center justify-around gap-2 mt-5'>
          <Input defaultValue={getInterviewURL()} disabled={true} />
          <Button className={'cursor-pointer'} onClick={() => onCopyLink()}><Copy className='size-4' /> Copy Link</Button>
        </div>

        <hr className='my-7' />

        <div className='flex flex-col md:flex-row gap-2 md:gap-0 items-center space-x-5'>
          <h2 className='flex items-center gap-2 text-xs lg:text-sm text-gray-500'><Clock className='size-4' />{formData.duration || '30 min'}</h2>
          <h2 className='flex items-center gap-2 text-xs lg:text-sm text-gray-500'><List className='size-4' />{formData?.questList?.length || '10'} Questions</h2>
          <h2 className='flex items-center gap-2 text-xs lg:text-sm text-gray-500'><Calendar className='size-4' />Valid Till: {expiresAt()} </h2>
        </div>
      </div>

      {/* Share job post */}
      <div className='w-full bg-white p-5 rounded-lg'>
        <h2 className='font-bold'>Share Job Post</h2>
        <div className='w-full flex items-center justify-center mt-5'>
          <Button className={'w-1/2'} onClick={() => shareJobPost('linkedin')}>
            <Linkedin className='size-4' /> {text}
          </Button>
        </div>
      </div>

      {/* Share Link */}
      <div className='w-full bg-white p-5 rounded-lg'>
        <h2 className='font-bold'>Share link via</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
          <Button variant={'outline'} className={'text-xs lg:text-sm'} onClick={() => handleShare('email')}>
            <Mail className='size-3 lg:size-4' /> Email
          </Button>
          <Button variant={'outline'} className={'text-xs lg:text-sm'} onClick={() => handleShare('linkedin')}>
            <Linkedin className='size-3 lg:size-4' /> Linkedin
          </Button>
          <Button variant={'outline'} className={'text-xs lg:text-sm'} onClick={() => handleShare('whatsapp')}>
            <Phone className='size-3 lg:size-4' /> WhatsApp
          </Button>
        </div>
      </div>

      {/* Buttons */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
        <Button variant={'outline'} className={'flex items-center gap-2'} onClick={() => router.push('/dashboard')}>
          <ArrowLeft className='size-4' /> Back to Dashboard
        </Button>
        <Button className={'flex items-center gap-2'} onClick={() => router.push('/dashboard/create-interview')}>
          <Plus className='size-4' /> Create New Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewLink;