package com.example.foominity.service.quiz;

import com.example.foominity.domain.quiz.RoundStore;
import com.example.foominity.dto.quiz.QuizAnswerResponse;
import com.example.foominity.dto.quiz.QuizHintResponse;
import com.example.foominity.dto.quiz.QuizStartResponse;
import com.example.foominity.dto.quiz.SearchTrack;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizService {

    private final SpotifyApiService spotifyApiService;
    private final RoundStore roundStore;

    @Value("${quiz.duration-seconds:30}")
    private int durationSeconds;

    @Value("${quiz.hint-seconds:10}")
    private int hintAfterSeconds;

    // === 장르/연도 필터 옵션 ===
    @Value("${quiz.filter.allowed-genres:}")
    private String allowedGenresCsv;

    @Value("${quiz.filter.min-year:2000}")
    private int minYear;

    @Value("${quiz.filter.max-year:2050}")
    private int maxYear;

    /** 라운드 시작 (Web Playback SDK용: preview 불필요) */
    public QuizStartResponse start(String query) {
        String roundId = UUID.randomUUID().toString();

        var allowedGenres = parseGenres(allowedGenresCsv);

        SearchTrack pick = spotifyApiService
                .pickRandomTrackFilteredRobust(
                        query,
                        allowedGenres,
                        minYear,
                        maxYear,
                        /* excludeExplicit */ false)
                .orElseThrow(() -> new RuntimeException("재생할 곡을 찾지 못했습니다."));

        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(durationSeconds);
        Instant hintAt = now.plusSeconds(hintAfterSeconds);

        roundStore.save(
                roundId,
                pick.getId(),
                pick.getTitle(),
                String.join(", ", pick.getArtists()),
                expiresAt,
                hintAt);

        // Web Playback SDK는 spotify:track:ID 형태의 URI 사용 가능
        String trackUri = "spotify:track:" + pick.getId();
        return new QuizStartResponse(
                roundId,
                trackUri,
                durationSeconds,
                hintAfterSeconds);
    }

    /** 정답 제출 — 유사도 없이 “정규화 후 완전 일치”만 정답 */
    public QuizAnswerResponse answer(String roundId, String userAnswer) {
        var round = roundStore.get(roundId)
                .orElseThrow(() -> new RuntimeException("퀴즈 라운드를 찾을 수 없습니다."));

        boolean timeout = Instant.now().isAfter(round.expiresAt());
        boolean correct = false;

        if (!timeout) {
            String gold = normalize(round.title());
            String guess = normalize(Optional.ofNullable(userAnswer).orElse(""));
            correct = !guess.isBlank() && gold.equals(guess);
        }

        roundStore.remove(roundId);

        return QuizAnswerResponse.builder()
                .roundId(roundId)
                .correctTitle(round.title())
                .correctArtist(round.artist())
                .correct(correct)
                .timeout(false)
                .build();
    }

    /** 힌트(아티스트명) */
    public QuizHintResponse hint(String roundId) {
        var round = roundStore.get(roundId)
                .orElseThrow(() -> new RuntimeException("퀴즈 라운드를 찾을 수 없습니다."));
        if (Instant.now().isBefore(round.hintAvailableAt())) {
            throw new RuntimeException("힌트를 아직 사용할 수 없습니다.");
        }
        return new QuizHintResponse(round.artist());
    }

    // --- util ---

    private static List<String> parseGenres(String csv) {
        if (csv == null || csv.isBlank())
            return List.of();
        return java.util.Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .toList();
    }

    /** 비교용 정규화: 소문자 → NFKC → 괄호/feat 제거 → 영문/숫자/한글만 → 공백 제거 */
    private static String normalize(String s) {
        if (s == null)
            return "";
        String n = s.toLowerCase();
        n = java.text.Normalizer.normalize(n, java.text.Normalizer.Form.NFKC);
        n = n.replaceAll("\\(.*?\\)|\\[.*?\\]|\\{.*?\\}", " "); // 괄호내용 제거
        n = n.replaceAll("\\bfeat\\.?\\b.*$", " "); // feat. 이후 제거
        n = n.replaceAll("[^0-9a-z가-힣]+", " "); // 영숫자/한글만
        n = n.replaceAll("\\s+", ""); // 공백 완전 제거
        return n;
    }
}
