package com.example.foominity.service.rapidapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;

@Service
public class LyricsService {

    @Value("${rapidapi.key}")
    private String rapidapiKey;

    @Value("${rapidapi.hosts.musixmatch}")
    private String musixmatchHost;

    private final RestTemplate rest = new RestTemplate();

    public ResponseEntity<String> getLyrics(String title, String artist) {
        // ⚠️ 프론트처럼 원문 그대로 보냄 (불필요 가공 X)
        String t = title == null ? "" : title;
        String a = artist == null ? "" : artist;

        // ✅ 프론트와 동일 파라미터(d=0:0, type=json) 그대로
        URI uri = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(musixmatchHost)
                .path("/songs/lyrics")
                .queryParam("t", t)
                .queryParam("a", a)
                .queryParam("d", "0:0")
                .queryParam("type", "json")
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", rapidapiKey);
        headers.set("X-RapidAPI-Host", musixmatchHost);

        try {
            ResponseEntity<String> upstream =
                    rest.exchange(uri, HttpMethod.GET, new HttpEntity<>(headers), String.class);

            // 업스트림 상태/본문을 그대로 전달 (500로 바꾸지 않음)
            return ResponseEntity.status(upstream.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(upstream.getBody());

        } catch (HttpStatusCodeException e) {
            // 업스트림 에러도 그대로 전달 (프론트 콘솔에서 원인 확인)
            String body = e.getResponseBodyAsString();
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body((body == null || body.isBlank()) ? "{\"error\":\"upstream error\"}" : body);
        }
    }
}
