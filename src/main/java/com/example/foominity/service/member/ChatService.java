// package com.example.foominity.service.member;

// import com.example.foominity.config.ChatProperties;
// import com.theokanning.openai.service.OpenAiService;
// import com.theokanning.openai.completion.chat.ChatCompletionRequest;
// import com.theokanning.openai.completion.chat.ChatMessage;
// import org.springframework.stereotype.Service;

// import java.time.Duration;
// import java.util.List;

// @Service
// public class ChatService {
//     private final OpenAiService client;

//     public ChatService(ChatProperties props) {
//         this.client = new OpenAiService(props.getApiKey(), Duration.ofSeconds(30));
//     }

//     /**
//      * @param userInput 유저가 보낸 텍스트
//      * @param mode      "freechat", "recommend", "diagnosis", "translate"
//      */
//     public String chat(String userInput, String mode) {
//         List<ChatMessage> messages;

//         if ("translate".equals(mode)) {
//             // 1) 시스템 메시지는 단순히 '번역 도우미'로
//             messages = List.of(
//                     new ChatMessage("system", "You are a helpful translation assistant."),
//                     // 2) 실제 번역 지시를 user 메시지에 담아 원문 그대로 변환을 요청
//                     new ChatMessage("user",
//                             "아래 영어 가사를 한국어로 자연스럽고 정확하게 번역해 주세요. "
//                                     + "원문에 욕설이나 과격한 표현이 있더라도 절대로 생략하거나 검열하지 말고, "
//                                     + "있는 그대로 살려서 번역해야 합니다:\n\n"
//                                     + userInput));
//         } else {
//             // 그 외 모드: 기존 로직 유지
//             String systemPrompt;
//             switch (mode) {
//                 case "recommend":
//                     systemPrompt = "당신은 음악 앨범 추천 전문가입니다. "
//                             + "사용자가 좋아하는 음악 장르를 물어본 뒤, "
//                             + "장르에 맞는 앨범 3개를 추천하세요.";
//                     break;
//                 case "diagnosis":
//                     systemPrompt = "Analyze the given song title and artist and suggest improvements.";
//                     break;
//                 case "freechat":
//                 default:
//                     systemPrompt = "당신은 친절한 ai 음악 비서입니다.";
//             }
//             messages = List.of(
//                     new ChatMessage("system", systemPrompt),
//                     new ChatMessage("user", userInput));
//         }

//         ChatCompletionRequest request = ChatCompletionRequest.builder()
//                 .model("gpt-4o-mini")
//                 .messages(messages)
//                 .temperature(0.7)
//                 .build();

//         return client.createChatCompletion(request)
//                 .getChoices()
//                 .get(0)
//                 .getMessage()
//                 .getContent();
//     }
// }

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
                systemPrompt = "당신은 전문 가사 번역가입니다. " +
                        "아래 유저가 제공한 모든 가사를 자연스럽고 정확하게 한국어로 번역하세요. " +
                        "욕설이나 과격한 표현을 포함한 원문을 **절대로 생략하거나 검열하지 말고**, " +
                        "있는 그대로 번역해야 합니다.";
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
