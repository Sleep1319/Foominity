import { useCallback, useEffect, useMemo, useState } from "react";
import { initPlayer, playTrackUri, pause, resume, getDeviceId, transferToWebPlayer } from "./spotifyplayer.js";
import { ensureUserTokenOrLogin } from "./tokenProvider.js";

// 프로필(product) 조회 (premium/free)
async function fetchProduct() {
  const token = await ensureUserTokenOrLogin();
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const me = await res.json();
  return me?.product || null;
}

export function useSpotifyPlayer() {
  const [device, setDevice] = useState(null);
  const [product, setProduct] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      await ensureUserTokenOrLogin();
      const id = await initPlayer((readyId) => setDevice(readyId));
      setDevice(id);

      // 연결 직후 디바이스 활성화 시도
      if (getDeviceId()) {
        await transferToWebPlayer();
      }

      // product 로드 (free/premium)
      const p = await fetchProduct();
      setProduct(p || null);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setConnecting(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      // 필요시 SDK 정리 로직 (현재는 생략)
    };
  }, []);

  const api = useMemo(() => ({ playTrackUri, pause, resume }), []);

  return {
    device: device || getDeviceId(),
    product,
    connecting,
    error,
    connect,
    ...api,
  };
}
