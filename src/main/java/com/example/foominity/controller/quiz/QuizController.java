package com.example.foominity.controller.quiz;

import com.example.foominity.dto.quiz.QuizAnswerRequest;
import com.example.foominity.dto.quiz.QuizAnswerResponse;
import com.example.foominity.dto.quiz.QuizHintResponse;
import com.example.foominity.dto.quiz.QuizStartResponse;
import com.example.foominity.service.quiz.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/start")
    public QuizStartResponse start(@RequestParam("query") String query) {
        return quizService.start(query);
    }

    @GetMapping("/{roundId}/hint")
    public QuizHintResponse hint(@PathVariable String roundId) {
        return quizService.hint(roundId); // 서비스가 DTO를 만들어 반환
    }

    @PostMapping(value = "/{roundId}/answer", consumes = "application/json")
    public QuizAnswerResponse answer(@PathVariable String roundId,
            @RequestBody QuizAnswerRequest req) {
        return quizService.answer(roundId, req.answer());
    }
}
