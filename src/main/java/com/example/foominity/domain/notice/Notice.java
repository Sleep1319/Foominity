package com.example.foominity.domain.notice;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Notice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
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
