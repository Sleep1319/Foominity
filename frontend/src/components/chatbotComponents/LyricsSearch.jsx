import React, { useState } from "react";

// 환경변수에서 RapidAPI 호스트/키 읽어오기
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

// 가사 가져오는 헬퍼 함수
async function fetchLyrics(title, artist) {
  const params = new URLSearchParams({ t: title, artist, type: "json" });
  const res = await fetch(`https://${API_HOST}/songs/lyrics?${params}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": API_HOST,
      "x-rapidapi-key": API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`API 오류: ${res.status}`);
  }
  return res.json();
}

export default function LyricsSearch() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!artist || !title) {
      setError("아티스트명과 곡 제목을 모두 입력하세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await fetchLyrics(title, artist);
      // RapidAPI 스펙에 맞춰 파싱
      const body = data?.lyrics_body ?? data?.message?.body?.lyrics?.lyrics_body;
      setLyrics(body || "가사를 찾을 수 없습니다.");
    } catch (e) {
      console.error(e);
      setError("가사 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>가사 검색</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          style={{ flex: 1 }}
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="아티스트명"
        />
        <input style={{ flex: 1 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="곡 제목" />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "검색 중…" : "검색"}
        </button>
      </div>
      {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f9f9f9",
          padding: 12,
          borderRadius: 4,
          minHeight: 200,
        }}
      >
        {lyrics}
      </pre>
    </div>
  );
}
