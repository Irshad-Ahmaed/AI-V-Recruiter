"use client";
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { Clock, Info, Loader, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase-client';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/context/InterviewDataContext';

const Interview = () => {
    const { interview_id } = useParams();

    const [interviewData, setInterviewData] = useState();
    const [error, setError] = useState();

    const [userName, setUsername] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);

    const router = useRouter();

    useEffect(() => {
        interview_id && fetchInterviewDetails();
    }, [interview_id]);

    const fetchInterviewDetails = async () => {
        try {
            setLoading(true);
            const { data: InterviewDetails, error } = await supabase
                .from('Job Postings')
                .select("jobPosition, duration")
                .eq("interviewId", interview_id);

            if (error) {
                console.error('Error fetching interview details:', error);
                toast.error(error.message);
                return;
            }

            if (InterviewDetails.length === 0) {
                toast.error("No Interview Found");
                return;
            }

            if (InterviewDetails && InterviewDetails.length > 0) {
                setInterviewData(InterviewDetails[0]);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onJoinInterview = async () => {
        setLoading(true);
        try {
            const { data: AllInterviewDetails, error } = await supabase
                .from('Job Postings')
                .select("jobPosition, duration, type, questionList")
                .eq("interviewId", interview_id);

            if (error) {
                console.error('Error fetching interview details:', error);
                toast.error(error.message);
                return;
            }

            if (AllInterviewDetails && AllInterviewDetails.length > 0) {
                console.log(AllInterviewDetails[0]);
                setInterviewInfo({
                    userName: userName,
                    userEmail: userEmail,
                    interviewData: AllInterviewDetails[0]
                });
                router.push('/interview/' + interview_id + '/start');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-64 pt-6'>
            <div className='flex flex-col items-center justify-center p-7 border rounded-lg bg-white'>
                <div className='flex'>
                    <Image src={'/logo.png'} alt='logo' width={100} height={100} className='size-8' />
                    <h1 className='font-bold flex items-center text-sky-400 z-10 text-lg relative'>
                        AI
                        <span className='absolute left-[20%] text-sky-300/80 text-3xl items-center z-0'>R</span>
                        <span className='text-black z-10 ml-0.5'>ecruiter</span>
                    </h1>
                </div>

                <h2 className='mt-3 text-muted-foreground font-semibold'>AI-Powered Interview Platform</h2>

                <Image src={'/Interview_logo.png'} alt='interview_logo' width={500} height={500} className='my-6' />

                <h2 className='font-bold text-xl'>{interviewData?.jobPosition || ""} Interview</h2>
                <h2 className='text-muted-foreground flex gap-2 items-center mt-3'><Clock className='size-4' />{interviewData?.duration || ""}</h2>

                <div className='w-full flex items-center flex-col justify-center mt-7 gap-3 text-sm'>
                    <div className='w-1/2 space-y-1 text-muted-foreground'>
                        <h2>Enter your full name</h2>
                        <Input placeholder='e.g. Alex Mercer'
                            className={'focus:border-0'}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='w-1/2 space-y-1 text-muted-foreground'>
                        <h2>Enter your Email</h2>
                        <Input placeholder='e.g. xyz123@gmail.com'
                            className={'focus:border-0'}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className='p-3 bg-blue-100 flex flex-col rounded-lg mt-7 w-1/3 justify-center'>
                    <div className='flex gap-2 text-primary items-center'>
                        <Info className='size-3' />
                        <h2 className='font-bold'>Before you begin</h2>
                    </div>
                    <ul className='flex flex-col'>
                        <li className='text-primary text-sm'>- Test your camera and microphone</li>
                        <li className='text-primary text-sm'>- Ensure you have a stable internet connection</li>
                        <li className='text-primary text-sm'>- Find a Quiet place for interview</li>
                    </ul>
                </div>

                <Button className={'flex items-center gap-2 mt-5 font-bold w-1/3 text-sm'}
                    disabled={!interviewData || loading || userName.length === 0 || !userEmail.includes("@gmail.com") || userEmail.length <= 14}
                    onClick={() => onJoinInterview()}
                >
                    {loading && <Loader className='size-4 animate-spin'/>} <Video className='size-4 mt-0.5' /> Join Interview
                </Button>
            </div>
        </div>
    );
};

export default Interview;