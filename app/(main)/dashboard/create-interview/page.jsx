"use client";
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';

const CreateInterview = () => {
  const route = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState([]);
  const [interviewId, setInterviewId] = useState(); 

  const onHandleInputChange = (field, value) =>{
    setFormData(prev=>({
      ...prev,
      [field]: value
    }));
  }

  const onGoToNext = () => {
    let missingField = '';

    if(!formData.companyName) missingField += 'CompanyName';
    if(!formData.jobPosition) missingField += 'jobPosition';
    else if(!formData.jobDescription) missingField += 'jobDescription';
    else if(!formData.duration) missingField += 'duration';
    else if(!formData.type) missingField += 'type';

    if(missingField){
      toast.error( `${missingField} is required` || "All fields are required")
      return;
    }
    setStep(step+1)
  }

  const onCreateLink = (interviewId) => {
    setInterviewId(interviewId);
    setStep(step+1);
  }
  
  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='relative flex gap-5 items-center justify-center'>
        <ArrowLeft className='size-9 cursor-pointer absolute left-0 hover:bg-gray-100 p-2 rounded-full' onClick={() => route.back()} />
        <h2 className='font-bold text-center text-2xl'>Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className='my-5' />

      {step === 1 ? <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={()=> onGoToNext()}/>
      : step ===2 ? <QuestionList formData={formData} onCreateLink={(interviewId)=> onCreateLink(interviewId)}/> 
      : step === 3 ? <InterviewLink interviewId={interviewId} formData={formData}/> : null
      }
    </div>
  );
};

export default CreateInterview;