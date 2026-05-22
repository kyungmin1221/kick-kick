import { useCallback, useState } from 'react';
import players from '../data/players_descriptors.json';
import { extractDescriptor, fileToImage, findBestMatch, loadModels } from '../utils/faceApi.js';

// 결과 구조:
// {
//   faceMatch: { player, similarity, mode },   // 얼굴 기준 닮은꼴
//   styleMatch: { player, type },              // 퀴즈 dominantType 기준
//   isPerfectMatch: boolean,                   // 둘이 같은 선수인지
// }
//
// 얼굴 descriptor가 하나도 없으면 face는 폴백(quiz-only)이고, faceMatch=styleMatch가 됨.

export function useFaceMatch() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async ({ file, dominantType }) => {
    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const styleMatchPlayer =
        players.find((p) => p.type === dominantType) || players[0];
      const styleMatch = { player: styleMatchPlayer, type: dominantType };

      const hasDescriptors = players.some(
        (p) => Array.isArray(p.descriptors) && p.descriptors.length > 0,
      );

      // 폴백: 얼굴 데이터 자체가 없으면 퀴즈 결과만 사용
      if (!hasDescriptors) {
        await new Promise((r) => setTimeout(r, 1000));
        setResult({
          faceMatch: {
            player: styleMatchPlayer,
            similarity: 75 + Math.floor(Math.random() * 16),
            mode: 'quiz-only',
          },
          styleMatch,
          isPerfectMatch: true,
        });
        setStatus('success');
        return;
      }

      // face-api 매칭
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

      // 같은 type이면 약간의 가산점 (얼굴 우선이지만 퀴즈와 일치하면 더 자신 있게)
      if (match.player.type === dominantType) {
        match.similarity = Math.min(99, match.similarity + 3);
      }

      const faceMatch = { ...match, mode: 'face+quiz' };
      setResult({
        faceMatch,
        styleMatch,
        isPerfectMatch: faceMatch.player.slug === styleMatchPlayer.slug,
      });
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
