package com.example.foominity.domain.notice;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.image.ImageFile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Magazine extends BaseEntity {

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

    // 앨범 이미지
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "image_file_id")
    private ImageFile imageFile;

    public Magazine(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void changeNotice() {
        this.mainNotice = true;
    }

    public void cancelNotice() {
        this.mainNotice = false;
    }

    public void setImageFile(ImageFile imageFile) {
        this.imageFile = imageFile;
    }
}
