import { useCallback, useMemo, useState } from 'react';
import { QUIZ_QUESTIONS, pickDominantType } from '../data/quiz.js';

export function useQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const total = QUIZ_QUESTIONS.length;
  const current = QUIZ_QUESTIONS[step] ?? null;
  const done = step >= total;

  const select = useCallback(
    (option) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = option;
        return next;
      });
      setStep((s) => s + 1);
    },
    [step],
  );

  const reset = useCallback(() => {
    setStep(0);
    setAnswers([]);
  }, []);

  const dominantType = useMemo(
    () => (done ? pickDominantType(answers) : null),
    [answers, done],
  );

  return {
    step,
    total,
    current,
    done,
    answers,
    dominantType,
    progress: Math.min(1, step / total),
    select,
    reset,
  };
}
