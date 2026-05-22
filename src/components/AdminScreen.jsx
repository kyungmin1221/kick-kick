import { useMemo, useRef, useState } from 'react';
import initialPlayers from '../data/players_descriptors.json';
import { extractDescriptor, fileToImage, loadModels } from '../utils/faceApi.js';

// /#admin 으로 진입하는 내부용 페이지.
// (A) 선수 카드별로 사진 추가 → 그 선수의 descriptors에 누적
// (B) 폴더 통째로 드롭 (`<input webkitdirectory>`) — 폴더명이 slug면 자동 라우팅
// 끝나면 "전체 JSON 다운로드"로 src/data/players_descriptors.json 통째 교체.

const LOG_LIMIT = 80;

export default function AdminScreen() {
  const [players, setPlayers] = useState(() => deepClone(initialPlayers));
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState([]);
  const [models, setModels] = useState({ ready: false, loading: false, error: null });
  const folderRef = useRef(null);

  const log = (msg, kind = 'info') =>
    setLogs((prev) => [{ id: Math.random(), kind, msg }, ...prev].slice(0, LOG_LIMIT));

  const ensureModels = async () => {
    if (models.ready) return true;
    setModels({ ready: false, loading: true, error: null });
    try {
      await loadModels();
      setModels({ ready: true, loading: false, error: null });
      return true;
    } catch (e) {
      setModels({
        ready: false,
        loading: false,
        error: 'face-api 모델 로딩 실패. `npm run download-models` 실행해주세요.',
      });
      log('모델 로딩 실패', 'err');
      return false;
    }
  };

  // 한 파일 → descriptor 추출
  const processOne = async (file) => {
    try {
      const image = await fileToImage(file);
      const desc = await extractDescriptor(image);
      return desc ? Array.from(desc) : null;
    } catch (e) {
      log(`오류 ${file.name}: ${e.message || e}`, 'err');
      return null;
    }
  };

  const appendDescriptors = (slug, newOnes) => {
    if (newOnes.length === 0) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, descriptors: [...(p.descriptors || []), ...newOnes] } : p,
      ),
    );
  };

  // (A) 한 선수 카드에서 사진 추가
  const handleFilesForPlayer = async (slug, files) => {
    if (!files || files.length === 0) return;
    const ok = await ensureModels();
    if (!ok) return;
    const player = players.find((p) => p.slug === slug);
    if (!player) return;

    setBusy(true);
    let ok_count = 0;
    let fail_count = 0;
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const desc = await processOne(file);
      if (desc) {
        appendDescriptors(slug, [desc]);
        ok_count += 1;
      } else {
        fail_count += 1;
        log(`✗ ${player.name} — ${file.name}: 얼굴 미검출`, 'warn');
      }
    }
    if (ok_count > 0) log(`✓ ${player.name} +${ok_count}장 (실패 ${fail_count})`, 'ok');
    setBusy(false);
  };

  // (B) 폴더 드롭 — webkitRelativePath의 두 번째 마지막 세그먼트를 slug로 사용
  const handleFolderPick = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    e.target.value = '';
    if (files.length === 0) return;

    const groups = {};
    for (const f of files) {
      const path = f.webkitRelativePath || f.name;
      const parts = path.split('/');
      const slug = (parts.length >= 2 ? parts[parts.length - 2] : 'unknown').toLowerCase();
      (groups[slug] = groups[slug] || []).push(f);
    }

    const ok = await ensureModels();
    if (!ok) return;

    setBusy(true);
    log(`폴더 처리 시작 — ${Object.keys(groups).length}개 폴더, 총 ${files.length}장`);

    const slugMap = new Map(players.map((p) => [p.slug, p]));
    for (const [slug, fileList] of Object.entries(groups)) {
      const player = slugMap.get(slug);
      if (!player) {
        log(`⚠️ 폴더 '${slug}'에 매칭되는 선수 없음 — ${fileList.length}장 스킵`, 'warn');
        continue;
      }
      let ok_count = 0;
      let fail_count = 0;
      const buffered = [];
      for (const file of fileList) {
        // eslint-disable-next-line no-await-in-loop
        const desc = await processOne(file);
        if (desc) {
          buffered.push(desc);
          ok_count += 1;
        } else {
          fail_count += 1;
        }
      }
      appendDescriptors(slug, buffered);
      log(`✓ ${player.name} +${ok_count}장 (실패 ${fail_count})`, 'ok');
    }
    log('폴더 처리 완료', 'ok');
    setBusy(false);
  };

  const clearPlayer = (slug) => {
    setPlayers((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, descriptors: [] } : p)),
    );
    const name = players.find((p) => p.slug === slug)?.name;
    log(`${name} 벡터 비움`, 'warn');
  };

  const handleResetAll = () => {
    if (!confirm('모든 선수의 descriptors를 비웁니다. 계속할까요?')) return;
    setPlayers((prev) => prev.map((p) => ({ ...p, descriptors: [] })));
    setLogs([]);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(players, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'players_descriptors.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log('JSON 다운로드 완료', 'ok');
  };

  const stats = useMemo(() => {
    const total = players.reduce((sum, p) => sum + (p.descriptors?.length || 0), 0);
    const covered = players.filter((p) => (p.descriptors?.length || 0) > 0).length;
    return { total, covered, players: players.length };
  }, [players]);

  return (
    <div className="screen admin">
      <header className="admin-header">
        <h1 className="admin-title">선수 벡터 어드민</h1>
        <p className="admin-desc">
          <b>(A)</b> 카드별로 사진 추가, <b>(B)</b> 폴더 통째 드롭 — 둘 다 됨.<br />
          폴더 컨벤션: <code>아무이름/&lt;slug&gt;/*.jpg</code> (예:{' '}
          <code>players/mbappe/01.jpg</code>). 다 끝나면{' '}
          <b>JSON 다운로드</b> → <code>src/data/players_descriptors.json</code> 통째 교체.
        </p>
        <div className="admin-model-state">
          {models.loading && <span>모델 불러오는 중...</span>}
          {models.ready && <span className="ok">● 모델 준비 완료</span>}
          {models.error && <span className="err">{models.error}</span>}
          {!models.loading && !models.ready && !models.error && (
            <span>모델은 첫 추출 때 자동으로 로드됩니다</span>
          )}
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-stats">
          <span>
            <b>{stats.covered}</b>/{stats.players} 선수
          </span>
          <span>
            벡터 <b>{stats.total}</b>개
          </span>
          {busy && <span className="busy">처리 중...</span>}
        </div>
        <div className="admin-toolbar-actions">
          <button
            className="btn-ghost-sm"
            disabled={busy}
            onClick={() => folderRef.current?.click()}
          >
            📁 폴더 통째 드롭
          </button>
          <button className="btn-ghost-sm" disabled={busy} onClick={handleResetAll}>
            전체 초기화
          </button>
          <button
            className="btn-primary-sm"
            disabled={busy || stats.total === 0}
            onClick={handleDownload}
          >
            JSON 다운로드
          </button>
        </div>
        <input
          ref={folderRef}
          type="file"
          // webkitdirectory와 directory는 attribute 형태로 들어가야 함
          // eslint-disable-next-line react/no-unknown-property
          webkitdirectory=""
          directory=""
          multiple
          hidden
          onChange={handleFolderPick}
        />
      </div>

      {logs.length > 0 && (
        <details className="admin-log" open>
          <summary>처리 로그 ({logs.length})</summary>
          <ul>
            {logs.map((l) => (
              <li key={l.id} className={`log-${l.kind}`}>
                {l.msg}
              </li>
            ))}
          </ul>
        </details>
      )}

      <ul className="admin-grid">
        {players.map((p) => (
          <PlayerCard
            key={p.slug}
            player={p}
            busy={busy}
            onAddFiles={handleFilesForPlayer}
            onClear={clearPlayer}
          />
        ))}
      </ul>
    </div>
  );
}

function PlayerCard({ player, busy, onAddFiles, onClear }) {
  const ref = useRef(null);
  const count = player.descriptors?.length || 0;
  const has = count > 0;

  return (
    <li className={`player-card ${has ? 'has' : ''}`}>
      <div className="player-flag">{player.countryFlag}</div>
      <div className="player-body">
        <div className="player-name">{player.name}</div>
        <div className="player-meta">
          {player.country} · {player.position} · <code>{player.slug}</code>
        </div>
        <div className={`player-count ${has ? 'ok' : ''}`}>
          {has ? `✓ 벡터 ${count}개` : '· 비어있음'}
        </div>
      </div>
      <div className="player-actions">
        <button
          className="btn-ghost-sm"
          disabled={busy}
          onClick={() => ref.current?.click()}
        >
          사진 추가
        </button>
        {has && (
          <button
            className="btn-ghost-sm subtle"
            disabled={busy}
            onClick={() => onClear(player.slug)}
          >
            비우기
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            onAddFiles(player.slug, Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
      </div>
    </li>
  );
}

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}
