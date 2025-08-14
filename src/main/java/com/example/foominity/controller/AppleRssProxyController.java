package com.example.foominity.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@RestController
public class AppleRssProxyController {

    private static final Logger log = LoggerFactory.getLogger(AppleRssProxyController.class);
    private static final String UPSTREAM = "https://rss.applemarketingtools.com";

    private final RestTemplate rest;

    public AppleRssProxyController() {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);

        this.rest = new RestTemplate(factory);
        // 4xx/5xx라도 예외 던지지 말고 그대로 반환
        this.rest.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) throws IOException {
                return false;
            }
        });
    }

    @GetMapping("/apple-feed/**")
    public ResponseEntity<byte[]> proxy(HttpServletRequest req) {
        // 컨텍스트 패스 고려 + /apple-feed 제거
        String requestPath = req.getRequestURI().substring(req.getContextPath().length());
        String path = requestPath.replaceFirst("^/apple-feed", "");
        String qs = req.getQueryString();

        // URL 안전하게 조합 (인코딩 보존)
        String url = UriComponentsBuilder.fromHttpUrl(UPSTREAM)
                .path(path)
                .query(qs)
                .build(true) // already-encoded
                .toUriString();

        log.info("[apple-feed] {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, "Foominity/1.0");
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        ResponseEntity<byte[]> upstream = rest.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), byte[].class);

        // 필요한 헤더만 패스스루
        HttpHeaders out = new HttpHeaders();
        MediaType ct = upstream.getHeaders().getContentType();
        if (ct != null)
            out.setContentType(ct);
        String cc = upstream.getHeaders().getFirst(HttpHeaders.CACHE_CONTROL);
        if (cc != null)
            out.set(HttpHeaders.CACHE_CONTROL, cc);

        return new ResponseEntity<>(upstream.getBody(), out, upstream.getStatusCode());
    }
}

// package com.example.foominity.controller;

// import jakarta.servlet.http.HttpServletRequest;
// import org.springframework.http.*;
// import org.springframework.http.client.SimpleClientHttpRequestFactory;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;

// @RestController
// public class AppleRssProxyController {

// // 정식 호스트로 교체
// private static final String UPSTREAM = "https://rss.applemarketingtools.com";

// private final RestTemplate rest;

// public AppleRssProxyController() {
// var factory = new
// org.springframework.http.client.SimpleClientHttpRequestFactory();
// factory.setConnectTimeout(5000);
// factory.setReadTimeout(10000);
// this.rest = new RestTemplate(factory);
// }

// @GetMapping("/apple-feed/**")
// public ResponseEntity<byte[]> proxy(HttpServletRequest req) {
// String path = req.getRequestURI().replaceFirst("^/apple-feed", "");
// String qs = req.getQueryString();
// String url = UPSTREAM + path + (qs != null ? "?" + qs : "");

// HttpHeaders headers = new HttpHeaders();
// headers.set(HttpHeaders.USER_AGENT, "Foominity/1.0");

// ResponseEntity<byte[]> upstream = rest.exchange(
// url, HttpMethod.GET, new HttpEntity<>(headers), byte[].class);

// HttpHeaders out = new HttpHeaders();
// MediaType ct = upstream.getHeaders().getContentType();
// if (ct != null)
// out.setContentType(ct);
// String cc = upstream.getHeaders().getFirst(HttpHeaders.CACHE_CONTROL);
// if (cc != null)
// out.set(HttpHeaders.CACHE_CONTROL, cc);

// return new ResponseEntity<>(upstream.getBody(), out,
// upstream.getStatusCode());
// }
// }
