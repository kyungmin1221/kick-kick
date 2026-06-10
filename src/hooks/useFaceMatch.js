import { useCallback, useState } from 'react';
import players from '../data/players_descriptors.json';
import { extractDescriptor, fileToImage, findBestMatch, loadModels } from '../utils/faceApi.js';

// 플레이 스타일 매칭은 한국 선수 풀에서만 — 일반 대중 인지도/공유 동기 고려
const koreanPlayers = players.filter((p) => p.country === '한국');
const pickStyleMatchPlayer = (dominantType) =>
  koreanPlayers.find((p) => p.type === dominantType) ||
  koreanPlayers[0] ||
  players[0];

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

    // 사용자 사진의 blob URL — 결과 카드 캐릭터 영역에 보여주기 위해 생성
    let userPhotoUrl = null;
    try {
      userPhotoUrl = URL.createObjectURL(file);

      const styleMatchPlayer = pickStyleMatchPlayer(dominantType);
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
          userPhotoUrl,
        });
        setStatus('success');
        return;
      }

      await loadModels();
      const image = await fileToImage(file);
      const userDescriptor = await extractDescriptor(image);
      if (!userDescriptor) {
        URL.revokeObjectURL(userPhotoUrl);
        throw new Error('얼굴을 찾지 못했어요. 정면 사진으로 다시 시도해주세요.');
      }

      const match = findBestMatch(userDescriptor, players);
      if (!match) {
        URL.revokeObjectURL(userPhotoUrl);
        throw new Error('매칭할 선수가 없습니다.');
      }

      if (match.player.type === dominantType) {
        match.similarity = Math.min(99, match.similarity + 3);
      }

      const faceMatch = { ...match, mode: 'face+quiz' };
      setResult({
        faceMatch,
        styleMatch,
        isPerfectMatch: faceMatch.player.slug === styleMatchPlayer.slug,
        userPhotoUrl,
      });
      setStatus('success');
    } catch (e) {
      if (userPhotoUrl) URL.revokeObjectURL(userPhotoUrl);
      setError(e.message || String(e));
      setStatus('error');
    }
  }, []);

  // 사진 없이 퀴즈 결과로만 매칭 (사용자가 인트로에서 "사진 없이" 선택한 경우)
  const analyzeQuizOnly = useCallback(async (dominantType) => {
    setStatus('loading');
    setError(null);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 700)); // 로딩 효과
      const styleMatchPlayer = pickStyleMatchPlayer(dominantType);
      setResult({
        faceMatch: null, // 사진을 안 올렸으므로 얼굴 매칭 없음
        styleMatch: { player: styleMatchPlayer, type: dominantType },
        isPerfectMatch: false,
      });
      setStatus('success');
    } catch (e) {
      setError(e.message || String(e));
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setResult((prev) => {
      if (prev?.userPhotoUrl) URL.revokeObjectURL(prev.userPhotoUrl);
      return null;
    });
    setStatus('idle');
    setError(null);
  }, []);

  return { status, result, error, analyze, analyzeQuizOnly, reset };
}
