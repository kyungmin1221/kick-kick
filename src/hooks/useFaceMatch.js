import { useCallback, useState } from 'react';
import players from '../data/players_descriptors.json';
import { extractDescriptor, fileToImage, findBestMatch, loadModels } from '../utils/faceApi.js';

// dominantType이 있으면 같은 type 선수에 가중치(보너스)를 주고,
// face descriptor가 비어있어도(Phase 1 데이터 미준비) dominantType 매칭으로 폴백.
export function useFaceMatch() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async ({ file, dominantType }) => {
    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      // 1) 같은 type 선수 우선 후보
      const typeMatch = players.find((p) => p.type === dominantType) || players[0];

      // 2) descriptor가 준비된 선수가 있는지 확인 (Phase 1 데이터 유무)
      const hasDescriptors = players.some(
        (p) => Array.isArray(p.descriptors) && p.descriptors.length > 0,
      );

      // descriptor 없으면 퀴즈 결과로만 매칭 (개발 단계 폴백)
      if (!hasDescriptors) {
        // 사용자 체감을 위한 약간의 대기
        await new Promise((r) => setTimeout(r, 1200));
        setResult({
          player: typeMatch,
          similarity: 75 + Math.floor(Math.random() * 16), // 75~90% 더미
          mode: 'quiz-only',
        });
        setStatus('success');
        return;
      }

      // 3) face-api 모델 로드 + descriptor 추출
      await loadModels();
      const image = await fileToImage(file);
      const userDescriptor = await extractDescriptor(image);
      if (!userDescriptor) {
        throw new Error('얼굴을 찾지 못했어요. 정면 사진으로 다시 시도해주세요.');
      }

      const match = findBestMatch(userDescriptor, players);
      if (!match) {
        throw new Error('매칭할 선수가 없습니다.');
      }

      // dominantType과 같은 선수면 약간의 가산점
      if (match.player.type === dominantType) {
        match.similarity = Math.min(99, match.similarity + 3);
      }

      setResult({ ...match, mode: 'face+quiz' });
      setStatus('success');
    } catch (e) {
      setError(e.message || String(e));
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, analyze, reset };
}
