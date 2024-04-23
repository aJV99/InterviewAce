import { Question } from '@/redux/dto/question.dto';
import { useState, useEffect } from 'react';
import AnimatedButton from './AnimatedButton';

interface GeneratingFeedbackButtonProps {
  jobLoading: string | null;
  cardId: string;
  jobId: string;
  questions: Question[];
}

const GeneratingFeedbackButton: React.FC<GeneratingFeedbackButtonProps> = ({
  jobLoading,
  cardId,
  jobId,
  questions,
}) => {
  const [percentage, setPercentage] = useState<string>('0');

  useEffect(() => {
    const totalQuestions = questions.length;
    const scoredQuestions = questions.filter((question) => question.score !== null).length;
    const completionPercentage = (scoredQuestions / totalQuestions) * 100;

    setPercentage(completionPercentage.toFixed(0)); // Round to nearest whole number
  }, [questions]);

  return (
    <AnimatedButton
      colorScheme="blue"
      destination={'/interview/' + jobId + '/' + cardId}
      isLoading={jobLoading === cardId ? true : false}
      loadingText={`Generating Feedback ${percentage}%`}
    >
      Get Practicing
    </AnimatedButton>
  );
};

export default GeneratingFeedbackButton;
