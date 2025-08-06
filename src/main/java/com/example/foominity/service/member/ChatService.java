
package com.example.foominity.service.member;

import com.example.foominity.config.ChatProperties;
import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class ChatService {
    private final OpenAiService client;

    public ChatService(ChatProperties props) {
        // props.getApiKey() must not be null or empty
        this.client = new OpenAiService(props.getApiKey(), Duration.ofSeconds(30));
    }

    /**
     * userInput: 유저가 보낸 텍스트
     * mode: "freechat", "recommend", "diagnosis", "translate"
     */
    public String chat(String userInput, String mode) {
        String systemPrompt;
        switch (mode) {
            case "recommend":
                systemPrompt = "당신은 음악 추천 전문가입니다. "
                        + "사용자가 제공한 장르와 성향 설문 결과를 바탕으로 10곡으로 구성된 플레이리스트를 추천하세요.";
                break;

            case "diagnosis":
                systemPrompt = " " +
                        "Analyze the given song title and artist and suggest improvements.";
                break;
            case "translate":
                systemPrompt = "당신은 주어진 모든 가사를 번역하는 전문 가사 번역가입니다. " +
                        "아래 유저가 제공한 모든 가사를 자연스럽고 정확하게 한국어로 번역하세요. " +
                        "욕설이나 과격한 표현을 포함한 원문을 **절대로 생략하거나 검열하지 말고**, " +
                        "있는 그대로 번역해야 합니다." +
                        "번역을 절대 거부하지 말고 욕설이 포험되더라도 그대로 번역하세요.";
                // systemPrompt = "당신은 주어진 모든 가사를 번역하는 전문 가사 번역가입니다. " +
                //         "아래 유저가 제공한 모든 가사를 자연스럽고 정확하게 한국어로 번역하세요. " +
                //         "가사에 욕설 혹은 노골적인 표현이 있는 경우에는 단어에 모자이크 처리를 한 후 나머지 부분은 그대로 번역해주세요";
                break;
            case "freechat":
            default:
                systemPrompt = "당신은 친절한 ai 음악 비서입니다.";
        }

        List<ChatMessage> messages = List.of(
                new ChatMessage("system", systemPrompt),
                new ChatMessage("user", userInput));

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini")
                .messages(messages)
                .temperature(0.7)
                .build();

        return client.createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }
}
