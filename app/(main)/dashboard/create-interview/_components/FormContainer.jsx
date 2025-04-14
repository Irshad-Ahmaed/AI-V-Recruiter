import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InterviewType } from '@/services/Constants';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const FormContainer = ({ onHandleInputChange, GoToNext }) => {
    const [interviewType, setInterviewType] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (interviewType) {
            onHandleInputChange('type', interviewType);
        }
    }, [interviewType]);

    const AddInterviewType = (type) => {
        const data = interviewType.includes(type);
        if (!data) {
            setInterviewType(prev => [...prev, type]);
        } else {
            const result = interviewType.filter((item) => item != type);
            setInterviewType(result);
        }
    };

    return (
        <>
            <div className='p-5 bg-white flex flex-col rounded-lg space-y-5'>
                {/* Input fields */}
                <div>
                    <h2 className='text-sm font-medium'>Job Position</h2>
                    <Input placeholder='ex: Frontend Developer'
                        className='mt-2 focus:border-0'
                        onChange={(e) => onHandleInputChange('jobPosition', e.target.value)}
                    />
                </div>
                <div>
                    <h2 className='text-sm font-medium'>Job Description</h2>
                    <Textarea
                        className='mt-2 h-[200px] focus:border-0' placeholder='Enter Detail Job description'
                        onChange={(e) => onHandleInputChange('jobDescription', e.target.value)}
                    />
                </div>

                {/* Select Dropdown */}
                <div>
                    <h2 className='text-sm font-medium'>Interview Duration</h2>
                    <Select className='mt-2 h-[200px] border-0' onValueChange={(value) => onHandleInputChange('duration', value)}>
                        <SelectTrigger className='w-full mt-2'>
                            <SelectValue placeholder='Select Duration' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='5 Min'>5 Min</SelectItem>
                            <SelectItem value='15 Min'>15 Min</SelectItem>
                            <SelectItem value='30 Min'>30 Min</SelectItem>
                            <SelectItem value='45 Min'>455 Min</SelectItem>
                            <SelectItem value='60 Min'>60 Min</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Tags */}
                <div>
                    <h2 className='text-sm font-medium'>Interview Type</h2>
                    <div className='flex flex-wrap gap-4 mt-2'>
                        {
                            InterviewType.map((type, index) => (
                                <div key={index}
                                    className={`flex items-center gap-2 p-1 px-2 border rounded-xl cursor-pointer  hover:border-0
                            ${interviewType.includes(type.title) ? 'bg-blue-50 border hover:bg-blue-50 border-blue-50 text-primary' : 'hover:bg-gray-200 border-gray-400'} transition-colors duration-all`}
                                    onClick={() => AddInterviewType(type.title)}
                                >
                                    <type.icon className='size-4' />
                                    <span className='text-sm'>{type.title}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-5 mt-5 w-full bg-blue-100 rounded-lg p-5'>
                <Loader2Icon className='rotate-[105deg] font-semibold text-primary'/>
                <div>
                    <h2 className='font-medium text-blue-900 text-sm'>Generating Interview Questions</h2>
                    <h1 className='font-semibold text-primary text-md'>Our AI is crafting personalized question based on your requirements...</h1>
                </div>
            </div>

            <div className='flex items-center justify-between mt-5'>
                <div onClick={() => router.push('/dashboard')}>
                    <Button className='cursor-pointer border bg-white text-black hover:bg-gray-50 hover:text-red-500'>Cancel</Button>
                </div>
                <div onClick={() => GoToNext()}>
                    <Button className='flex cursor-pointer items-center'>Generate Questions <ArrowRight size={22} className='mt-0.5' /></Button>
                </div>
            </div>
        </>
    );
};

export default FormContainer;