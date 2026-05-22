# face-api.js 모델 파일

이 폴더에 face-api.js의 가중치 파일을 받아두면 `/models` 경로에서 로드됩니다.
필요한 모델:

- `tiny_face_detector_model-weights_manifest.json` (+ shard)
- `face_landmark_68_model-weights_manifest.json` (+ shard)
- `face_recognition_model-weights_manifest.json` (+ shard)

받는 곳: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

받지 않으면 face-api 매칭은 실패하고, 앱은 퀴즈 결과로만 매칭하는 폴백 모드로 동작합니다.
