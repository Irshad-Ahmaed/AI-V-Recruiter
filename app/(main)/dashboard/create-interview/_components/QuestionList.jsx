import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabase-client';
import { useUser } from '@/app/provider';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';

const QuestionList = ({ formData, setStep }) => {
  console.log('formData', formData);
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionsList] = useState();
  const { user } = useUser();
  const [savingData, setSavingData] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // GenerateQuestionList();
  }, [formData]);

  console.log(questionList);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', { ...formData });
      const content = result.data.content;
      let FINAL_CONTENT = content.replace('```json', '').replace('```', '');
      setQuestionsList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
      console.log(FINAL_CONTENT);

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSavingData(true);
    const interviewId = v4();
    try {
      const { data, error } = await supabase
        .from('Job Postings')
        .insert([
          {
            ...formData,
            questionList: questionList,
            userId: user?.email,
            interviewId: interviewId,
          },
        ])
        .select();

      if (error) {
        toast.error(error);
        return;
      }
      setStep(3);
      console.log(data);
      toast.success("Job role created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingData(false);
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    }
  };

  return (
    <div>
      {loading &&
        <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2 className='font-medium'>Generating Interview questions</h2>
            <p className='text-primary'>Our AI crafting personalized questions for your job position</p>
          </div>
        </div>
      }

      {
        questionList?.length > 0 &&
        <QuestionListContainer questionList={questionList} />
      }

      {
        !loading &&
        <div className='flex justify-end mt-10'>
          <Button className='cursor-pointer text-md px-6 py-2'
            onClick={() => onFinish()} disabled={savingData}>
            {savingData && <Loader2Icon className='animate-spin size-5' />} Finish
          </Button>
        </div>
      }
    </div>
  );
};

export default QuestionList;