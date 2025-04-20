"use client";
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, MicOff, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Vapi from "@vapi-ai/web";
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import { getVapiClient } from '@/lib/vapiClient';
import axios from 'axios';
import { supabase } from '@/services/supabase-client';
import { useParams, useRouter } from 'next/navigation';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const {interview_id} = useParams();
    const router = useRouter();

    const [activeUser, setActiveUser] = useState(false);
    const [activeRecruiter, setActiveRecruiter] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [vapiStart, setVapiStart] = useState();
    const [loading, setLoading] = useState(false);

    const vapi = getVapiClient();

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

        let questionList;
        interviewInfo?.interviewData?.questionList.forEach((item, index) => {
            questionList = item?.question + ',' + questionList;
        });

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: "Hi" + interviewInfo?.userName + ", how are you? Ready for your interview on" + interviewInfo?.interviewData?.jobPosition + "?",
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            voice: {
                provider: "playht",
                voiceId: "jennifer",
            },
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `
            You are an AI voice assistant conducting interviews.
            Your job is to ask candidates provided interview questions, assess their responses.
            Begin the conversation with a friendly introduction(introduce your self like: 
            "Hi I'm AI recruiter at 'XYZ' company and I'm going to take your ${interviewInfo?.interviewData?.jobPosition} interview ), 
            setting a relaxed yet professional tone. Example:
            "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
            Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are
            the questions ask one by one:
            Questions: ${questionList}
            If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
            "Need a hint? Think about how React tracks component updates!"
            Provide brief, encouraging feedback after each answer. Example:
            s'a solid answer."
            "Nice! That's a solid answer"
            "Hmm, not quite! Want to try again?"
            Keep the conversation natural and engaging-use casual phrases like "Alright, next up ... " or "Let's tackle a tricky one!"
            After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
            "That was great! You handled some tough questions well. Keep sharpening your skills!"
            End on a positive note:
            "Thanks for chatting! Hope to see you crushing projects soon!"
            Key Guidelines:
            - Be friendly, engaging, and witty.
            - Keep responses short and natural, like a real conversation.
            - Adapt based on the candidate's confidence level.
            - Ensure the interview remains focused on React.
            `.trim(),
                    },
                ],
            },
        };

        try {
            let call = await vapi.start(assistantOptions);
            setVapiStart(() => call);
            console.log('call', call);
            console.log("✅ Call started?", vapi.call); // should now show call object
        } catch (error) {
            console.error("❌ Failed to start call", error);
        }
    };

    useEffect(() => {
        const handleCallStart = () => {
            toast.success("Call Connected...");
            setActiveRecruiter(true);
            setActiveUser(false);
            setCallActive(true);
        };

        const handleSpeechStart = () => {
            console.log("🎤 Assistant speech started");
        };

        const handleSpeechEnd = () => {
            console.log("🛑 Assistant speech ended");
            setActiveUser(true);
            setActiveRecruiter(false);
        };

        const handleCallEnd = async () => {
            toast.success("Interview Ended...");
            setCallActive(false);
            GenerateFeedback();
        };

        const handleMessage = (message) => {
            console.log("📩 Message:", message);
            if(message && message?.conversation){
                const filteredConversation = message?.conversation.filter(msg => msg.role !== "system") || '';
                const conversationString = JSON.stringify(filteredConversation, null, 2);
                console.log('conversationString', conversationString);
                conversationRef.current = conversationString
            }
        };

        const volumeLevel = (volume) => {
            console.log(`Assistant volume level: ${volume}`);
        };


        vapi.on('volume-level', volumeLevel);
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
            vapi.off("volume-level", volumeLevel);
            vapi.off("call-end", handleCallEnd);
            vapi.off("message", handleMessage);
        };
    }, [vapiStart]);

    const endInterview = () => {
        console.log('stop');
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
            console.log(result);
            const Content = result?.data?.content;
            const FINAL_CONTENT = Content.replace("```json", '').replace("```", '');
            console.log(FINAL_CONTENT);
            const { data, error } = await supabase
                .from('Interview-feedback')
                .insert([
                    { userName: interviewInfo?.userName,
                        userEmail: interviewInfo?.userEmail,
                        interviewId: interview_id,
                        feedback: JSON.parse(FINAL_CONTENT),
                        conversation: conversationRef.current
                    },
                ])
            .select();
            
            if(error){
                console.log('error saving data in supabase', error);
                return;
            }
            console.log('inserted data', data);
            router.replace('/interview/'+ interview_id + '/completed');
        } catch (error) {
            console.log('Error while saving feedback', error);
        } finally{
            setLoading(false);
        }
    };


    return (
        <div className='p-20 lg:px-48 xl:px-56 h-screen'>
            <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
                <span className='flex gap-2 items-center'>
                    <Timer className='size-4' />
                    00:00:00
                </span>
            </h2>

            <div className='grid gap-7 grid-cols-1 md:grid-cols-2 mt-5'>
                <div className='bg-white p-20 h-[400px] rounded-lg border'>
                    <div className='relative h-full flex flex-col gap-3 items-center justify-center'>
                        <Image src={'/interviewr_logo.jpg'} alt='interviewer_image' width={100} height={100} className='w-[80px] h-[80px] shadow rounded-full' />
                        <h2>AI Recruiter</h2>
                        {/* Wave effect */}
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