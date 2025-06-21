package com.example.foominity.domain.notice;

import com.example.foominity.domain.member.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean mainNotice = false;

    public Notice(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void changeNotice() {
        this.mainNotice = true;
    }

    public void cancelNotice() {
        this.mainNotice = false;
    }
}
