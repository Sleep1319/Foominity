package com.example.foominity.service.quiz;

import com.example.foominity.config.quiz.SpotifyProperties;
import com.example.foominity.dto.quiz.SearchTrack;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SpotifyApiService {

    private final WebClient spotifyWebClient; // baseUrl: https://api.spotify.com
    private final SpotifyTokenService tokenService; // client-credentials (검색/조회용)
    private final SpotifyProperties props;

    public SpotifyApiService(
            @Qualifier("spotifyWebClient") WebClient spotifyWebClient,
            SpotifyTokenService tokenService,
            SpotifyProperties props) {
        this.spotifyWebClient = spotifyWebClient;
        this.tokenService = tokenService;
        this.props = props;
    }

    /*
     * =========================
     * 외부 공개 메서드
     * =========================
     */

    /**
     * 강건한 랜덤 픽(프리뷰 불필요):
     * - 여러 쿼리 변형 + 여러 마켓 + 페이지네이션
     * - explicit 제외 옵션
     * - 연도 범위(minYear~maxYear)
     * - 장르 허용(부분일치, 대소문자 무시). 장르 미확인=통과
     * - 실패 시 Recommendations(seed_genres)로 시도
     */
    public Optional<SearchTrack> pickRandomTrackFilteredRobust(
            String query,
            List<String> allowedGenres,
            int minYear,
            int maxYear,
            boolean excludeExplicit) {
        final String token = tokenService.getAccessToken();

        // market 후보
        List<String> markets = new ArrayList<>();
        if (props.market() != null && !props.market().isBlank())
            markets.add(props.market()); // KR을 맨 앞에
        for (String m : List.of("US", "GB", "JP", "CA"))
            if (!markets.contains(m))
                markets.add(m);
        markets.add(null);

        // 쿼리 변형
        String base = safe(query);
        LinkedHashSet<String> queries = new LinkedHashSet<>();
        if (base.isBlank())
            queries.add("pop");
        else
            queries.add(base);
        queries.add(base.replace("-", ""));
        queries.add(base.replace("-", " "));
        if (base.equalsIgnoreCase("k-pop") || base.equalsIgnoreCase("kpop")) {
            queries.add("korean pop");
        }

        // 1) 검색 결과를 모아 필터링
        for (String q : queries) {
            for (String market : markets) {
                List<Candidate> pool = new ArrayList<>();

                for (int offset = 0; offset <= 200; offset += 50) {
                    JsonNode page = safeSearch(token, q, market, offset, 50);
                    int raw = page == null ? 0 : page.path("tracks").path("items").size();
                    List<Candidate> cands = collectCandidatesNoPreview(page, minYear, maxYear, excludeExplicit);
                    pool.addAll(cands);
                    log.info("page q='{}' market={} offset={} -> collected={}, raw={}",
                            q, market, offset, cands.size(), raw);
                }

                if (!pool.isEmpty()) {
                    // 아티스트 장르 배치 조회
                    Map<String, List<String>> artistGenres = fetchArtistsGenresBatch(
                            token,
                            pool.stream().flatMap(c -> c.artistIds.stream()).collect(Collectors.toSet()));

                    // 장르 필터 (장르 정보가 없으면 통과)
                    List<Candidate> filtered = pool.stream()
                            .filter(c -> passesGenreLenient(c.artistIds, artistGenres, allowedGenres))
                            .toList();

                    List<Candidate> target = filtered.isEmpty() ? pool : filtered;
                    Candidate pick = target.get(ThreadLocalRandom.current().nextInt(target.size()));
                    return Optional.of(pick.track);
                }

                log.info("no pick: q='{}', market={}", q, market);
            }
        }

        // 2) Recommendations(seed_genres) — preview 불요
        List<String> seeds = normalizeGenres(allowedGenres);
        if (!seeds.isEmpty()) {
            for (String market : markets) {
                Optional<SearchTrack> rec = pickFromRecommendationsNoPreview(
                        token, seeds, minYear, maxYear, excludeExplicit, market);
                if (rec.isPresent())
                    return rec;
            }
        }

        // 3) 최후: 단순 검색에서 아무거나 하나
        for (String q : queries) {
            for (String market : markets) {
                for (int offset = 0; offset <= 200; offset += 50) {
                    JsonNode page = safeSearch(token, q, market, offset, 50);
                    List<SearchTrack> any = mapToTracksBasic(page);
                    if (!any.isEmpty()) {
                        return Optional.of(any.get(ThreadLocalRandom.current().nextInt(any.size())));
                    }
                }
            }
        }
        return Optional.empty();
    }

    /*
     * =========================
     * 내부 유틸
     * =========================
     */

    private JsonNode doSearch(String token, String query, String market, int offset, int limit) {
        // market이 비었으면 'from_token'으로 강제
        final String marketParam = (market == null || market.isBlank()) ? "from_token" : market;

        return spotifyWebClient.get()
                .uri(u -> u.path("/v1/search")
                        .queryParam("q", query)
                        .queryParam("type", "track")
                        .queryParam("limit", Math.max(1, Math.min(50, limit)))
                        .queryParam("offset", Math.max(0, offset))
                        .queryParam("market", marketParam)
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block(Duration.ofSeconds(7));
    }

    private JsonNode safeSearch(String token, String query, String market, int offset, int limit) {
        try {
            return doSearch(token, query, market, offset, limit);
        } catch (WebClientResponseException e) {
            log.warn("search error q='{}' market={} status={} body={}",
                    query, market, e.getRawStatusCode(), truncate(e.getResponseBodyAsString(), 300));
            return null;
        } catch (Exception e) {
            log.warn("search exception q='{}' market={} : {}", query, market, e.toString());
            return null;
        }
    }

    /** preview_url을 요구하지 않는 후보 수집 */
    private List<Candidate> collectCandidatesNoPreview(JsonNode root, int minYear, int maxYear,
            boolean excludeExplicit) {
        List<Candidate> result = new ArrayList<>();
        if (root == null)
            return result;

        JsonNode items = root.path("tracks").path("items");
        if (!items.isArray() || items.size() == 0)
            return result;

        for (JsonNode item : items) {
            boolean explicit = item.path("explicit").asBoolean(false);
            if (excludeExplicit && explicit)
                continue;

            String id = textOrNull(item, "id");
            String title = textOrNull(item, "name");

            // 발매연도
            int year = parseYear(textOrNull(item.path("album"), "release_date"));
            if (year != -1 && (year < minYear || year > maxYear))
                continue;

            // 이미지(선택)
            String imageUrl = null;
            JsonNode images = item.path("album").path("images");
            if (images.isArray() && images.size() > 0) {
                imageUrl = images.get(0).path("url").asText(null);
            }

            // 아티스트들
            List<String> artists = new ArrayList<>();
            List<String> artistIds = new ArrayList<>();
            for (JsonNode a : item.path("artists")) {
                String name = a.path("name").asText(null);
                String aid = a.path("id").asText(null);
                if (name != null)
                    artists.add(name);
                if (aid != null)
                    artistIds.add(aid);
            }

            result.add(new Candidate(
                    SearchTrack.builder()
                            .id(id)
                            .title(title)
                            .artists(artists)
                            .imageUrl(imageUrl)
                            .build(),
                    year, explicit, artistIds));
        }
        return result;
    }

    /** 단순 매핑 (preview 없이) */
    private List<SearchTrack> mapToTracksBasic(JsonNode root) {
        List<SearchTrack> result = new ArrayList<>();
        if (root == null)
            return result;

        JsonNode items = root.path("tracks").path("items");
        if (!items.isArray())
            return result;

        for (JsonNode item : items) {
            String id = textOrNull(item, "id");
            String title = textOrNull(item, "name");

            List<String> artists = new ArrayList<>();
            for (JsonNode a : item.path("artists")) {
                String name = a.path("name").asText(null);
                if (name != null)
                    artists.add(name);
            }

            String imageUrl = null;
            JsonNode images = item.path("album").path("images");
            if (images.isArray() && images.size() > 0) {
                imageUrl = images.get(0).path("url").asText(null);
            }
            result.add(
                    SearchTrack.builder()
                            .id(id)
                            .title(title)
                            .artists(artists)
                            .imageUrl(imageUrl)
                            .build());

        }
        return result;
    }

    /** 아티스트 장르 일괄 조회 (/v1/artists?ids=...) */
    private Map<String, List<String>> fetchArtistsGenresBatch(String token, Set<String> artistIds) {
        Map<String, List<String>> result = new HashMap<>();
        if (artistIds == null || artistIds.isEmpty())
            return result;

        List<String> ids = new ArrayList<>(artistIds);
        int from = 0;
        while (from < ids.size()) {
            int to = Math.min(from + 50, ids.size());
            String idParam = String.join(",", ids.subList(from, to));
            from = to;

            try {
                JsonNode root = spotifyWebClient.get()
                        .uri(u -> u.path("/v1/artists").queryParam("ids", idParam).build())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block(Duration.ofSeconds(7));

                if (root == null)
                    continue;
                JsonNode artists = root.path("artists");
                if (!artists.isArray())
                    continue;

                for (JsonNode a : artists) {
                    String id = a.path("id").asText(null);
                    if (id == null)
                        continue;
                    List<String> genres = new ArrayList<>();
                    for (JsonNode g : a.path("genres")) {
                        String gv = g.asText(null);
                        if (gv != null)
                            genres.add(gv.toLowerCase());
                    }
                    result.put(id, genres);
                }
            } catch (WebClientResponseException e) {
                log.warn("artist genres error status={} body={}", e.getRawStatusCode(),
                        truncate(e.getResponseBodyAsString(), 300));
            } catch (Exception e) {
                log.warn("artist genres exception: {}", e.toString());
            }
        }
        return result;
    }

    /** 장르 필터 (장르 불명=통과) */
    private boolean passesGenreLenient(List<String> artistIds,
            Map<String, List<String>> artistGenres,
            List<String> allowedGenres) {
        if (allowedGenres == null || allowedGenres.isEmpty())
            return true;

        List<String> all = new ArrayList<>();
        for (String id : artistIds) {
            List<String> g = artistGenres.get(id);
            if (g != null && !g.isEmpty())
                all.addAll(g);
        }
        if (all.isEmpty())
            return true; // 장르 정보 없으면 통과

        for (String g : all) {
            for (String allow : allowedGenres) {
                if (g.contains(allow))
                    return true;
            }
        }
        return false;
    }

    private Optional<SearchTrack> pickFromRecommendationsNoPreview(
            String token,
            List<String> seedGenres,
            int minYear,
            int maxYear,
            boolean excludeExplicit,
            String market) {
        List<String> seeds = seedGenres.stream()
                .map(s -> s.replace(" ", "-"))
                .distinct()
                .limit(5)
                .toList();
        if (seeds.isEmpty())
            return Optional.empty();

        try {
            JsonNode root = spotifyWebClient.get()
                    .uri(u -> {
                        var b = u.path("/v1/recommendations")
                                .queryParam("seed_genres", String.join(",", seeds))
                                .queryParam("limit", 100)
                                .queryParam("min_popularity", 30);
                        if (market != null && !market.isBlank())
                            b.queryParam("market", market);
                        return b.build();
                    })
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block(Duration.ofSeconds(7));

            if (root == null)
                return Optional.empty();

            List<Candidate> pool = new ArrayList<>();
            for (JsonNode t : root.path("tracks")) {
                boolean explicit = t.path("explicit").asBoolean(false);
                if (excludeExplicit && explicit)
                    continue;

                int year = parseYear(textOrNull(t.path("album"), "release_date"));
                if (year != -1 && (year < minYear || year > maxYear))
                    continue;

                String id = textOrNull(t, "id");
                String title = textOrNull(t, "name");

                String imageUrl = null;
                JsonNode images = t.path("album").path("images");
                if (images.isArray() && images.size() > 0) {
                    imageUrl = images.get(0).path("url").asText(null);
                }

                List<String> artists = new ArrayList<>();
                List<String> artistIds = new ArrayList<>();
                for (JsonNode a : t.path("artists")) {
                    String name = a.path("name").asText(null);
                    String aid = a.path("id").asText(null);
                    if (name != null)
                        artists.add(name);
                    if (aid != null)
                        artistIds.add(aid);
                }
                pool.add(new Candidate(
                        SearchTrack.builder()
                                .id(id)
                                .title(title)
                                .artists(artists)
                                .imageUrl(imageUrl)
                                .build(),
                        year, explicit, artistIds));

            }

            if (!pool.isEmpty()) {
                Candidate pick = pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
                log.info("recommendations pick via seeds={}: {}", seeds, pick.track.getTitle());
                return Optional.of(pick.track);
            }
        } catch (WebClientResponseException e) {
            log.warn("recommendations error status={} body={}", e.getRawStatusCode(),
                    truncate(e.getResponseBodyAsString(), 300));
        } catch (Exception e) {
            log.warn("recommendations exception: {}", e.toString());
        }
        return Optional.empty();
    }

    /* 공통 헬퍼들 */

    private static String textOrNull(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return (v == null || v.isNull()) ? null : v.asText();
    }

    private static int parseYear(String releaseDate) {
        if (releaseDate == null || releaseDate.isBlank())
            return -1;
        String y = releaseDate.substring(0, Math.min(4, releaseDate.length()));
        try {
            return Integer.parseInt(y);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static String safe(String s) {
        return s == null ? "" : s.trim();
    }

    private static String truncate(String s, int max) {
        if (s == null)
            return null;
        return s.length() <= max ? s : s.substring(0, max) + "...";
    }

    /* 내부 후보 객체 */
    private static final class Candidate {
        final SearchTrack track;
        final int year;
        final boolean explicit;
        final List<String> artistIds;

        Candidate(SearchTrack track, int year, boolean explicit, List<String> artistIds) {
            this.track = track;
            this.year = year;
            this.explicit = explicit;
            this.artistIds = artistIds;
        }
    }

    private List<String> normalizeGenres(List<String> allowedGenres) {
        if (allowedGenres == null)
            return List.of();
        return allowedGenres.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isBlank())
                .toList();
    }

    /** 현재 마켓에서 재생 가능한 트랙만 통과시키기 */
    private boolean isPlayableForMarket(JsonNode track) {
        // track 레벨에서 is_playable=false면 제외
        if (track.has("is_playable") && !track.get("is_playable").asBoolean())
            return false;

        // track.restrictions.reason == "market"/"product"/"explicit" 면 제외
        JsonNode tr = track.path("restrictions");
        if (tr.has("reason")) {
            String reason = tr.get("reason").asText();
            if ("market".equals(reason) || "product".equals(reason) || "explicit".equals(reason))
                return false;
        }

        // album 레벨에도 restrictions가 있을 수 있음 → 동일하게 체크
        JsonNode ar = track.path("album").path("restrictions");
        if (ar.has("reason")) {
            String reason = ar.get("reason").asText();
            if ("market".equals(reason) || "product".equals(reason) || "explicit".equals(reason))
                return false;
        }

        return true; // 위 조건에 걸리지 않으면 playable로 간주
    }

}
