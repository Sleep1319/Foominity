package com.example.foominity.service.openai;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.foominity.dto.openai.AlbumRecommendRequest;
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

    public String askChatGPT(String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("model", "gpt-4o");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "당신은 최고의 앨범 추천모델 입니다."),
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

    public List<String> askAlbumRecommendations(AlbumRecommendRequest req) throws IOException {
        String prompt = buildPrompt(req);
        String raw = askChatGPT(prompt);

        System.out.println("✅ GPT 응답 원본:\n" + raw);

        return List.of(raw.split("\n")).stream()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }

    private String buildPrompt(AlbumRecommendRequest req) {
        return """
                다음 정보를 바탕으로 힙합 앨범 5개를 추천해주세요.
                반드시 **앨범 제목만 한 줄에 하나씩** 정확하게 출력해 주세요.
                출력 형식: 앨범명 (아티스트명) 은 생략하고 앨범명만!

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
}
