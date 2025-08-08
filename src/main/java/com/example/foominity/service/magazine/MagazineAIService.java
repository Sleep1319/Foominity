package com.example.foominity.service.magazine;

import com.example.foominity.service.openai.OpenAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MagazineAIService {

    private final OpenAIService openAIService;

    public List<String> extractKeyPoints(String translatedContent) {
        // AI 호출을 위한 프롬프트 구성
        String prompt = String.format(
                "다음은 음악과 관련된 기사입니다. 이 글을 읽고 전체 내용을 아우르는 핵심 요약을 두 문장으로 작성해주세요.\n\n" +
                        "- 요약은 원문 문장을 그대로 복사하지 말고, 의미를 유지하되 AI가 새롭게 재구성한 표현으로 써주세요.\n" +
                        "- 문장은 간결하면서도 정보가 풍부해야 하며, 인물의 업적이나 사건의 맥락이 잘 드러나야 합니다.\n" +
                        "- 반드시 2문장으로만 구성하고, 숫자·고유명사 등은 필요한 경우 포함해주세요.\n" +
                        "- 톤은 신뢰감 있는 뉴스 기사 요약 스타일로, 자연스럽고 매끄럽게 써주세요.\n" +
                        "- 줄바꿈으로 문장을 구분하고, 항목 기호나 번호는 쓰지 마세요.\n\n" +
                        "기사 내용:\n%s",
                translatedContent.replace("\"", "'"));

        try {
            // OpenAIService를 통해 GPT 호출
            String aiResponse = openAIService.askChatGPT(prompt).trim();

            // 줄 단위로 분리하여 리스트로 반환
            return aiResponse.lines()
                    .map(String::trim)
                    .filter(line -> !line.isEmpty())
                    .toList();

        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
