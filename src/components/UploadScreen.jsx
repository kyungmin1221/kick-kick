import { useRef, useState } from 'react';

export default function UploadScreen({ onSubmit }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePick = (f) => {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleChange = (e) => {
    handlePick(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handlePick(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="screen upload">
      <h2 className="upload-title">사진을 업로드해주세요</h2>
      <p className="upload-desc">밝은 조명, 얼굴이 또렷한 정면 사진이 가장 정확해요.</p>

      <div
        className={`upload-dropzone ${previewUrl ? 'has-preview' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="미리보기" className="upload-preview" />
        ) : (
          <div className="upload-empty">
            <div className="upload-icon">📷</div>
            <div className="upload-empty-text">탭하여 사진을 선택하세요</div>
            <div className="upload-empty-sub">JPG, PNG / 5MB 이하 권장</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </div>

      <button
        className="btn-primary"
        disabled={!file}
        onClick={() => file && onSubmit(file)}
      >
        분석 시작
      </button>
    </div>
  );
}
