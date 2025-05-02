"use client";
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, MicOff, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import { getVapiClient } from '@/lib/vapiClient';
import axios from 'axios';
import { supabase } from '@/services/supabase-client';
import { useParams, useRouter } from 'next/navigation';
import TimmerComponent from './_components/TimmerComponent';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const { interview_id } = useParams();
    const router = useRouter();

    const [activeUser, setActiveUser] = useState(false);
    const [activeRecruiter, setActiveRecruiter] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [vapiStart, setVapiStart] = useState();

    const [startTimer, setStartTimer] = useState(false);
    const [loading, setLoading] = useState(false);

    let vapi = getVapiClient();

    const conversationRef = useRef("");

    useEffect(() => {
        if (interviewInfo) {
            startCall();
        }
    }, [interviewInfo]);

    const startCall = async () => {
        if (!vapi) {
            console.log('returning from startCall');
            return;
        }

        const questionList = interviewInfo?.interviewData?.questionList
            ?.map((item) => item?.question)
            ?.join(', ');

        try {
            const call = await vapi.start(process.env.NEXT_PUBLIC_RECRUITER_AGENT_KEY, {
                variableValues: {
                    userName: interviewInfo?.userName,
                    jobPosition: interviewInfo?.interviewData?.jobPosition,
                    interview_id: interview_id,
                    questionList: questionList,
                }
            });

            call && setVapiStart(call);

            // console.log('call', call);
            // console.log('vapiStart', vapiStart);

            // ✅ Save the call ID to Supabase
            call && await fetch('/api/save-call-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callId: call?.id,
                }),
            });
        } catch (error) {
            console.error("❌ Failed to start call", error);
        }
    };

    useEffect(() => {
        if(!vapiStart) return;

        const handleCallStart = () => {
            toast.success("Call Connected...");
            setActiveRecruiter(true);
            setActiveUser(false);
            setCallActive(true);
            setTimeout(()=>{
                setStartTimer(true); // timer set
            }, 1000);
        };

        const handleSpeechStart = () => {
            console.log("🎤 Assistant speech started");
            setActiveUser(false);
            setActiveRecruiter(true);
        };

        const handleSpeechEnd = () => {
            console.log("🛑 Assistant speech ended");
            
            setActiveUser(true);
            setActiveRecruiter(false);
        };

        const handleCallEnd = async () => {
            toast.success("Interview Ended...");
            setCallActive(false);
            setStartTimer(false);

            GenerateFeedback();
        };

        const handleMessage = (message) => {
            // console.log("📩 Message:", message);
            if (message && message?.conversation) {
                const filteredConversation = message?.conversation.filter(msg => msg.role !== "system") || '';
                const conversationString = JSON.stringify(filteredConversation, null, 2);
                // console.log('conversationString', conversationString);
                conversationRef.current = conversationString;
            }
        };

        // const volumeLevel = (volume) => {
        //     console.log(`Assistant volume level: ${volume}`);
        // };


        // vapi.on('volume-level', volumeLevel);
        vapi.on("call-start", handleCallStart);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("call-end", handleCallEnd);
        vapi.on("message", handleMessage);

        // 🔥 Optional Cleanup (just in case user navigates away)
        return () => {
            vapi.off("call-start", handleCallStart);
            vapi.off("speech-start", handleSpeechStart);
            vapi.off("speech-end", handleSpeechEnd);
            // vapi.off("volume-level", volumeLevel);
            vapi.off("call-end", handleCallEnd);
            vapi.off("message", handleMessage);
        };
    }, [vapiStart]);

    const endInterview = () => {
        console.log('stop');
        setActiveRecruiter(false);
        setActiveUser(false);

        vapi.stop();
    };

    const onMuteUser = () => {
        if (!callActive || !vapi?.call) {
            toast.error("Call is not active yet.");
            return;
        }

        setIsMuted(() => !isMuted);
        vapi.setMuted(!isMuted);
    };

    const GenerateFeedback = async () => {
        setLoading(true);
        try {
            const result = await axios.post("/api/ai-feedback", {
                conversation: conversationRef.current
            });

            const Content = result?.data?.content;
            const FINAL_CONTENT = Content.replace("```json", '').replace("```", '');

            const { data, error } = await supabase
                .from('Interview-feedback')
                .update([
                    {
                        userName: interviewInfo?.userName,
                        userEmail: interviewInfo?.userEmail,
                        interviewId: interview_id,
                        feedback: JSON.parse(FINAL_CONTENT),
                        conversation: conversationRef.current
                    },
                ])
                .eq('call_id', vapiStart?.id)
                .select();

            if (error) {
                console.log('error saving data in supabase', error);
                return;
            }
            console.log('inserted data', data);
            router.replace('/interview/' + interview_id + '/completed');
        } catch (error) {
            console.log('Error while saving feedback', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='p-20 lg:px-48 xl:px-56 h-screen'>
            <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
                <span className='flex gap-2 items-center'>
                    {/* 00:00:00 */}
                    {!startTimer ? <span className='text-sm'>Connecting...</span> : <><Timer className='size-4' /> <TimmerComponent start={startTimer} /> </>}
                </span>
            </h2>

            <div className='grid gap-7 grid-cols-1 md:grid-cols-2 mt-5'>
                <div className='bg-white p-20 h-[400px] rounded-lg border'>
                    <div className='relative h-full flex flex-col gap-3 items-center justify-center'>
                        <Image src={'/interviewr_logo.jpg'} alt='interviewer_image' width={100} height={100} className='w-[80px] h-[80px] shadow rounded-full' />
                        <h2>AI Recruiter</h2>
                        {
                            activeRecruiter &&
                            <div className='flex absolute mt-4 bg-gray-300 py-3 px-2 rounded-full left-[55%]'>
                                <span className='wave-bar'></span>
                                <span className='wave-bar'></span>
                                <span className='wave-bar'></span>
                            </div>
                        }
                    </div>
                </div>
                <div className='bg-white p-20 h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                    <div className='relative h-full flex flex-col gap-3 items-center justify-center'>
                        <Image src={'/user.png'} alt='interviewer_image' width={100} height={100} className='w-[80px] h-[80px] shadow rounded-full' />
                        <h2>{interviewInfo?.userName || ""}</h2>
                        {/* Wave effect */}
                        {
                            activeUser && !isMuted &&
                            <div className='flex absolute mt-4 bg-gray-300 py-3 px-2 rounded-full left-[68%]'>
                                <span className='wave-bar'></span>
                                <span className='wave-bar'></span>
                                <span className='wave-bar'></span>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className='flex gap-5 items-center justify-center mt-7'>
                {callActive &&
                    isMuted ?
                    <MicOff onClick={onMuteUser} className='size-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer hover:scale-105 hover:shadow transition-all duration-300' />
                    :
                    <Mic onClick={onMuteUser} className='size-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer hover:scale-105 hover:shadow transition-all duration-300' />
                }
                <AlertConfirmation stopInterviewMethod={() => endInterview()}>
                    {
                        !loading &&
                        <Phone className='size-12 p-3 bg-red-500 text-white rounded-full cursor-pointer 
                            hover:scale-105 hover:shadow transition-all duration-300'
                        />
                    }
                </AlertConfirmation>
            </div>
            <h2 className='text-sm text-muted-foreground text-center mt-5'>Interview is in Progress...</h2>
        </div>
    );
};

export default StartInterview;