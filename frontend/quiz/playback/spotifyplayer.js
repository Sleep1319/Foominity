import { ensureUserTokenOrLogin } from "./tokenProvider.js";

let _player = null;
let _deviceId = null;

export const getDeviceId = () => _deviceId;

// --- SDK 로더 ---
function loadSdk() {
  if (typeof window !== "undefined" && window.Spotify) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="sdk.scdn.co/spotify-player.js"]')) {
      if (window.Spotify) return resolve();
      window.onSpotifyWebPlaybackSDKReady = () => resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const s = document.createElement("script");
    s.src = "https://sdk.scdn.co/spotify-player.js";
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Spotify Web Playback SDK"));
    document.head.appendChild(s);
  });
}

// --- Web API 헬퍼: 항상 '순수 문자열 토큰' 사용 ---
async function api(path, options = {}) {
  const token = await ensureUserTokenOrLogin(); // ← 이제 무조건 string 반환
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "omit",
  });
  return res;
}

// --- 초기화 ---
export async function initPlayer(onReady) {
  if (_player && _deviceId) {
    onReady && onReady(_deviceId);
    return _deviceId;
  }

  await loadSdk();

  // SDK가 내부적으로 콜백에 "문자열 토큰"만 기대하므로 반드시 string 보장
  const getOAuthToken = async (cb) => {
    try {
      const token = await ensureUserTokenOrLogin(); // string
      cb(token);
    } catch (e) {
      console.error("getOAuthToken error:", e);
    }
  };

  _player = new window.Spotify.Player({
    name: "Foominity Quiz",
    getOAuthToken, // 문자열 토큰만 전달
    volume: 1.0,
  });

  _player.addListener("ready", ({ device_id }) => {
    _deviceId = device_id;
    onReady && onReady(device_id);
  });
  _player.addListener("not_ready", ({ device_id }) => {
    if (_deviceId === device_id) _deviceId = null;
  });

  _player.addListener("initialization_error", ({ message }) => console.error("initialization_error:", message));
  _player.addListener("authentication_error", ({ message }) => console.error("authentication_error:", message));
  _player.addListener("account_error", ({ message }) => console.error("account_error:", message));
  _player.addListener("playback_error", ({ message }) => console.error("playback_error:", message));

  const ok = await _player.connect();
  if (!ok) throw new Error("Spotify SDK connect() failed");
  return _deviceId;
}

// --- 디바이스 전환(브라우저 디바이스 활성화) ---
export async function transferToWebPlayer() {
  if (!_deviceId) throw new Error("SDK device is not ready yet");
  const res = await api("/me/player", {
    method: "PUT",
    body: JSON.stringify({ device_ids: [_deviceId], play: false }),
  });
  if (!res.ok && res.status !== 204) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* empty */
    }
    console.warn("transferToWebPlayer failed", res.status, detail);
  }
  await new Promise((r) => setTimeout(r, 300));
}

// --- 재생/일시정지 ---
export async function playTrackUri(trackUri, positionMs = 0) {
  if (!_deviceId) throw new Error("No SDK device yet");
  await transferToWebPlayer();

  const body = trackUri ? { uris: [trackUri], position_ms: positionMs } : {};

  const res = await api(`/me/player/play?device_id=${_deviceId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.error?.message || msg;
    } catch {
      /* empty */
    }
    throw new Error(`Spotify play failed: ${msg}`);
  }
}

export async function pause() {
  if (!_deviceId) return;
  await api(`/me/player/pause?device_id=${_deviceId}`, { method: "PUT" }).catch(() => {});
}

export async function resume() {
  if (!_deviceId) return;
  await playTrackUri(null);
}
