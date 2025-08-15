package com.example.foominity.service.openai;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.foominity.dto.openai.AlbumRecommendRequest;
import com.example.foominity.dto.openai.ArtistRecommendRequest;
import com.example.foominity.dto.openai.CommentSummaryRequest;
import com.example.foominity.dto.openai.CommentSummaryResponse;
import com.example.foominity.dto.openai.LikeRecommendRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {

    @Value("${openai.api-key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String askChatGPT(String systemMessage, String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemMessage),
                Map.of("role", "user", "content", prompt)));

        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .post(RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("GPT 호출 실패: " + response);
            }

            JsonNode jsonNode = objectMapper.readTree(response.body().string());
            return jsonNode.get("choices").get(0).get("message").get("content").asText();
        }
    }

    public String askChatGPTJson(String systemMessage, String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemMessage),
                Map.of("role", "user", "content", prompt)));
        // 👇 JSON만 반환하도록 강제
        requestBody.put("response_format", Map.of("type", "json_object"));

        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .post(RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("GPT 호출 실패: " + response);
            }
            JsonNode jsonNode = objectMapper.readTree(response.body().string());
            return jsonNode.get("choices").get(0).get("message").get("content").asText();
        }
    }

    public List<String> askAlbumRecommendations(AlbumRecommendRequest req) throws IOException {
        String prompt = buildPrompt(req);
        String raw = askChatGPT(GptRole.ALBUM_RECOMMENDER.getMessage(), prompt);

        System.out.println("✅ GPT 응답 원본:\n" + raw);

        return List.of(raw.split("\n")).stream()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }

    public List<String> askArtistRecommendations(ArtistRecommendRequest req) throws IOException {
        String prompt = artistsPrompt(req);
        String raw = askChatGPT(GptRole.ARTIST_RECOMMENDER.getMessage(), prompt);

        System.out.println("✅ GPT 응답 원본:\n" + raw);

        return List.of(raw.split("\n")).stream()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }

    public List<String> askLikeRecommendations(LikeRecommendRequest req) throws IOException {
        String prompt = likePrompt(req);
        String raw = askChatGPT(GptRole.USER_PERSONAL_RECOMMENDER.getMessage(), prompt);

        System.out.println("✅ GPT 응답 원본:\n" + raw);

        return List.of(raw.split("\n")).stream()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }

    public CommentSummaryResponse askCommentSummary(CommentSummaryRequest req) throws IOException {
        String prompt = commentPrompt(req);

        String json = askChatGPTJson(
                "You are a strict summarizer.",
                prompt + "\n\n반드시 이 JSON 스키마로만 출력하세요: {\"positive\": string, \"negative\": string}");

        return new ObjectMapper().readValue(json, CommentSummaryResponse.class);
    }

    private String commentPrompt(CommentSummaryRequest req) {
        String joined = String.join("\n", req.getCommentAndRatings());

        return """
                다음은 특정 앨범에 담긴 리뷰댓글들입니다.
                각 댓글들에 대해 별점 2.5점 이하는 부정적 댓글, 3.0점 이상은 긍정적 댓글로 분류한 후,
                긍정적 평가 / 부정적 평가들을 한국어(2~3문장)으로 요약해주세요.

                댓글 목록:
                %s

                출력 형식(반드시 지켜주세요):
                긍정:
                - (요약 2~3문장)

                부정:
                - (요약 2~3문장)

                """.formatted(joined);
    }

    private String buildPrompt(AlbumRecommendRequest req) {
        return """
                아래 정보를 기반으로, 이 앨범의 음악적 특성과 분위기를 먼저 유추한 후,
                그와 유사한 톤과 스타일의 앨범, 해당 앨범 아티스트의 유사한 다른 앨범, 해당 앨범에 참여한 다른 아티스트들의 유사 앨범을 15개 추천해주세요.
                반드시 **앨범 제목만 한 줄에 하나씩** 정확하게 출력해 주세요.
                출력 형식:  (아티스트명, 특수문자 등등) 은 모두 생략하고 앨범명만 그대로!

                참고: 프로덕션 스타일(로우파이/하이파이/샘플 기반 등), 감정적 톤, 자주 협업하는 아티스트, 장르적 색깔 등을 기반으로 판단해 주세요.

                - 앨범명: %s
                - 아티스트명: %s
                - 카테고리: %s
                - 톤앤매너: %s
                - 특징: %s
                """.formatted(
                req.getAlbum(),
                String.join(", ", req.getArtist()),
                String.join(", ", req.getCategory()),
                req.getTone(),
                req.getFocus());
    }

    private String artistsPrompt(ArtistRecommendRequest req) {
        return """
                아래 정보를 기반으로,
                그와 자주 협업한 아티스트, 유사한 스타일의 아티스트를 15명 추천해주세요.
                반드시 **아티스트 이름만 한 줄에 하나씩** 정확하게 출력해 주세요.

                참고: 프로덕션 스타일(로우파이/하이파이/샘플 기반 등), 협업하는 아티스트, 장르적 색깔 등을 기반으로 판단해 주세요.

                - 아티스트명: %s
                - 카테고리: %s
                - 톤앤매너: %s
                - 특징: %s
                """.formatted(
                req.getArtist(),
                String.join(", ", req.getCategory()),
                req.getTone(),
                req.getFocus());

    }

    private String likePrompt(LikeRecommendRequest req) {
        return """
                사용자가 좋게 평가한 앨범의 평점들과 좋아요 한 앨범들의 정보를 기반으로,
                그와 유사한 톤과 스타일의 앨범을 5개 추천해주세요.
                반드시 **앨범 제목만 한 줄에 하나씩** 정확하게 출력해 주세요.
                출력 형식: 앨범명 *(아티스트명)* 은 생략하고 *앨범명*만!

                참고: 프로덕션 스타일(로우파이/하이파이/샘플 기반 등), 감정적 톤, 자주 협업하는 아티스트, 장르적 색깔 등을 기반으로 판단해 주세요.

                - 평가 참여한 앨범: %s
                - 좋아요 한 앨범: %s
                - 톤앤매너: %s
                - 특징: %s
                """.formatted(
                String.join(", ", req.getReviewAlbum()),
                String.join(", ", req.getLikeAlbum()),
                req.getTone(),
                req.getFocus());
    }
}
