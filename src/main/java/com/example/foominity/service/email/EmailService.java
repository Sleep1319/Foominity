package com.example.foominity.service.email;

import com.example.foominity.domain.email.EmailVerification;
import com.example.foominity.exception.VerificationCodeExpiredException;
import com.example.foominity.exception.VerificationCodeMismatchException;
import com.example.foominity.exception.VerificationNotRequestedException;
import com.example.foominity.repository.email.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final EmailVerificationRepository emailVerificationRepository;

    private static final int EXPIRATION_MINUTES = 5;

    @Transactional
    public void sendVerificationMail(String email) {
        String code = VerificationCodeGenerator.generate();

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .map(ev -> {
                    ev.updateCode(code, expiresAt);
                    return ev;
                })
                .orElse(new EmailVerification(email, code, expiresAt));

        emailVerificationRepository.save(verification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[Foominity] 이메일 인증 코드");
        message.setText("인증 코드: " + code);
        mailSender.send(message);
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .orElseThrow(VerificationNotRequestedException::new);

        if (verification.isExpired()) {
            throw new VerificationCodeExpiredException();
        }

        if (!verification.getCode().equals(code)) {
            throw new VerificationCodeMismatchException();
        }

        verification.markVerified();
        return true;
    }

    public boolean isVerified(String email) {
        return emailVerificationRepository.findByEmail(email)
                .map(EmailVerification::isVerified)
                .orElse(false);
    }
}
