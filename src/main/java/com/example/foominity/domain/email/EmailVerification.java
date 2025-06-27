package com.example.foominity.domain.email;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(nullable = false)
    private LocalDateTime expiration;

    public EmailVerification(String email, String code, LocalDateTime expiration) {
        this.email = email;
        this.code = code;
        this.expiration = expiration;
        this.verified = false;
    }

    public void updateCode(String newCode, LocalDateTime newExpiration) {
        this.code = newCode;
        this.expiration = newExpiration;
        this.verified = false;
    }

    public boolean isExpired() {
        return expiration.isBefore(LocalDateTime.now());
    }

    public void markVerified() {
        this.verified = true;
    }
}
