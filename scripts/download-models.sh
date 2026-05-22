#!/usr/bin/env bash
# face-api.js 모델 가중치를 public/models/ 로 받는다. 한 번만 실행하면 됨.
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/models"
mkdir -p "$DIR"

BASE="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

FILES=(
  "tiny_face_detector_model-weights_manifest.json"
  "tiny_face_detector_model-shard1"
  "face_landmark_68_model-weights_manifest.json"
  "face_landmark_68_model-shard1"
  "face_recognition_model-weights_manifest.json"
  "face_recognition_model-shard1"
  "face_recognition_model-shard2"
)

for f in "${FILES[@]}"; do
  echo "→ $f"
  curl -fsSL "$BASE/$f" -o "$DIR/$f"
done

echo "완료: $DIR"
