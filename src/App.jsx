import { useEffect, useState } from 'react';
import IntroScreen from './components/IntroScreen.jsx';
import QuizScreen from './components/QuizScreen.jsx';
import UploadScreen from './components/UploadScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultCard from './components/ResultCard.jsx';
import AdminScreen from './components/AdminScreen.jsx';
import { useQuiz } from './hooks/useQuiz.js';
import { useFaceMatch } from './hooks/useFaceMatch.js';

// 화면 단계 머신: intro → quiz → upload → loading → result
// #admin 해시면 별도의 어드민(벡터 추출) 페이지로 분기.
export default function App() {
  const quiz = useQuiz();
  const face = useFaceMatch();
  const [started, setStarted] = useState(false);
  const [route, setRoute] = useState(() =>
    typeof window !== 'undefined' && window.location.hash === '#admin'
      ? 'admin'
      : 'main'
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash === '#admin' ? 'admin' : 'main');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleStart = () => {
    quiz.reset();
    face.reset();
    setStarted(true);
  };

  const handleUpload = (file) => {
    face.analyze({ file, dominantType: quiz.dominantType });
  };

  const handleRestart = () => {
    face.reset();
    quiz.reset();
    setStarted(false);
  };

  useEffect(() => {
    if (face.status === 'error' && face.error) {
      alert(face.error);
    }
  }, [face.status, face.error]);

  let stage = 'intro';
  if (face.status === 'success') stage = 'result';
  else if (face.status === 'loading') stage = 'loading';
  else if (quiz.done) stage = 'upload';
  else if (started) stage = 'quiz';

  if (route === 'admin') {
    return (
      <div className="app">
        <div className="app-bg" />
        <main className="app-main app-main-wide">
          <AdminScreen />
        </main>
        <footer className="app-footer">KickKick · admin</footer>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-bg" />
      <main className="app-main">
        {stage === 'intro' && <IntroScreen onStart={handleStart} />}
        {stage === 'quiz' && (
          <QuizScreen
            step={quiz.step}
            total={quiz.total}
            question={quiz.current}
            onSelect={quiz.select}
          />
        )}
        {stage === 'upload' && <UploadScreen onSubmit={handleUpload} />}
        {stage === 'loading' && <LoadingScreen />}
        {stage === 'result' && face.result && (
          <ResultCard
            result={face.result}
            answers={quiz.answers}
            onRestart={handleRestart}
          />
        )}
      </main>
      <footer className="app-footer">
        <div>KickKick : 킥킥 | 2026 월드컵 나와 닮은 축구선수는?</div>
      </footer>
    </div>
  );
}
