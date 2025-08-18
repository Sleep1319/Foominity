// frontend/quiz/playback/tokenProvider.js
export async function ensureUserTokenOrLogin() {
  const res = await fetch("/api/quiz/auth/token", {
    method: "GET",
    credentials: "include",
  });

  // 401이면 반드시 백엔드의 Spotify OAuth로 이동 (loginpage 무시)
  if (res.status === 401) {
    const BACKEND_ORIGIN =
      (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")) ||
      "http://127.0.0.1:8084";

    let loginUrl = `${BACKEND_ORIGIN}/oauth2/authorization/spotify`;

    // 서버가 loginUrl을 줬고 그게 spotify oauth라면 그대로 사용(상대경로면 절대경로화)
    try {
      const data = await res.json();
      const fromServer = data?.loginUrl;
      if (typeof fromServer === "string" && fromServer.includes("/oauth2/authorization/spotify")) {
        loginUrl = fromServer.startsWith("http") ? fromServer : `${BACKEND_ORIGIN}${fromServer}`;
      }
    } catch {
      /* ignore parse error */
    }

    // 뒤로 가기 남기지 않으려면 replace 사용
    window.location.replace(loginUrl);
    throw new Error("redirecting-to-spotify");
  }

  if (!res.ok) {
    throw new Error(`auth/token failed: HTTP ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));

  // 다양한 포맷 대응
  let token =
    typeof data === "string" ? data : data?.accessToken ?? data?.access_token ?? data?.token ?? data?.jwt ?? null;

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  if (!token || !String(token).trim()) {
    throw new Error("No access token in /api/quiz/auth/token response");
  }
  return String(token).trim();
}
