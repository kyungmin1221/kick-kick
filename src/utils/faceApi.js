import * as faceapi from 'face-api.js';

// face-api.js 모델 파일 경로. public/models 폴더에 미리 다운로드해두거나
// CDN 경로(예: https://justadudewhohacks.github.io/face-api.js/models) 사용.
const MODEL_URL = '/models';

let modelsLoaded = false;
let loadingPromise = null;

export async function loadModels() {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  })();

  return loadingPromise;
}

// File / Blob → HTMLImageElement
export function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// 업로드 이미지에서 128차원 face descriptor 추출
export async function extractDescriptor(image) {
  await loadModels();
  const detection = await faceapi
    .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 416 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor || null;
}

// 코사인 유사도. face-api는 보통 L2 거리(euclideanDistance)를 쓰지만,
// 셀럽미 류 서비스에서 자주 쓰는 코사인 유사도도 충분히 좋다.
function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// 선수 풀 중 가장 닮은 선수와 유사도(%) 반환
export function findBestMatch(userDescriptor, players) {
  let best = null;
  let bestScore = -Infinity;

  for (const player of players) {
    if (!player.descriptors || player.descriptors.length === 0) continue;
    for (const desc of player.descriptors) {
      const score = cosineSimilarity(userDescriptor, desc);
      if (score > bestScore) {
        bestScore = score;
        best = player;
      }
    }
  }

  if (!best) return null;

  // -1 ~ 1 범위를 0 ~ 100 %로 매핑 (대부분 0.5~0.95 사이에서 분포)
  const percent = Math.max(0, Math.min(100, Math.round(((bestScore + 1) / 2) * 100)));
  return { player: best, similarity: percent };
}
