export async function ensureUserTokenOrLogin() {
  const res = await fetch("/api/quiz/auth/token", {
    method: "GET",
    credentials: "include",
  });

  // 401, 400 로그인 유도
  if (res.status === 401 || res.status === 400) {
    let loginUrl = "/oauth2/authorization/spotify";
    try {
      const data = await res.json().catch(() => ({}));
      if (data?.loginUrl) loginUrl = data.loginUrl;
    } finally {
      window.location.href = loginUrl;
      // eslint-disable-next-line no-unsafe-finally
      throw new Error("Redirecting to Spotify login...");
    }
  }

  if (!res.ok) {
    throw new Error(`auth/token failed: HTTP ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  let token =
    typeof data === "string" ? data : data?.accessToken ?? data?.access_token ?? data?.token ?? data?.jwt ?? null;

  if (!token) throw new Error("No access token in /api/quiz/auth/token response");
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice("Bearer ".length);
  }
  if (typeof token !== "string" || !token.trim()) throw new Error("Invalid token format");
  return token.trim();
}
