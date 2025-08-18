export function loadSpotifySDK() {
  return new Promise((resolve, reject) => {
    // 이미 로드 되어있음
    if (window.Spotify) return resolve(window.Spotify);

    // 기존 태그가 있으면 콜백만 연결
    const existing = document.getElementById("spotify-sdk");
    if (existing) {
      window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
      return;
    }

    // 새로 로드
    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
    const script = document.createElement("script");
    script.id = "spotify-sdk";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => reject(new Error("Spotify SDK load failed"));
    document.body.appendChild(script);
  });
}
