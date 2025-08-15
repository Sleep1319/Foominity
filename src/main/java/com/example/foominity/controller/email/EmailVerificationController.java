package com.example.foominity.controller.email;

import com.example.foominity.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailService emailService;

    @PostMapping("/api/email/send-code")
    public ResponseEntity<?> sendCode(@RequestParam String email) {
        LocalDateTime expiresAt = emailService.sendVerificationMail(email);
        return ResponseEntity.ok(Map.of("expiresAt", expiresAt)); // ✅ 만료시각 내려줌
    }

    @PostMapping("/api/email/verify")
    public ResponseEntity<?> verifyCode(@RequestParam String email,
                                        @RequestParam String code) {
        boolean success = emailService.verifyCode(email, code);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/email/is-verified")
    public ResponseEntity<?> checkVerified(@RequestParam String email) {
        boolean verified = emailService.isVerified(email);
        return ResponseEntity.ok(verified);
    }
}
