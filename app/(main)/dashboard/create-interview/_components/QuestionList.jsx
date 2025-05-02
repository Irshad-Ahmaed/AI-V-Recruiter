import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabase-client';
import { useUser } from '@/app/provider';
import { v4 } from 'uuid';

const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionsList] = useState([]);
  const { user } = useUser();
  const [savingData, setSavingData] = useState(false);


  useEffect(() => {
    formData && GenerateQuestionList();
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', { ...formData });
      const content = result.data.content;
      let FINAL_CONTENT = content.replace('```json', '').replace('```', '');
      setQuestionsList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
      console.log(FINAL_CONTENT);
      toast.success("Questions created successfully");
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
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
            userEmail: user?.email,
            interviewId: interviewId,
            Valid_till: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        ])
        .select();

      if (error) {
        toast.error('Something went wrong');
        console.log(error);
        return;
      }

      setTimeout(() => {
        onCreateLink(interviewId);
      }, 300);

      toast.success("Questions saved successfully");
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      setSavingData(false);
    }
  };

  return (
    <div>
      <h1 className='text-primary font-bold text-2xl w-full text-center mb-2'>2. Generating & Confirm Interview Questions</h1>
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
        !loading && questionList?.length > 0 &&
        <div className='flex justify-end mt-10'>
          <Button className='cursor-pointer text-md px-6 py-2'
            onClick={() => onFinish()} disabled={savingData}>
            {savingData && <Loader2Icon className='animate-spin size-5' />} Finalize & Generate Interview Link
          </Button>
        </div>
      }
    </div>
  );
};

export default QuestionList;