package com.example.foominity.domain.artist;

import java.time.LocalDate;

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
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 아티스트 이름
    @Column(nullable = false, unique = true)
    private String name;

    // 출생
    private LocalDate born;

    // 국적, 출신지
    private String nationality;

    // 아티스트 이미지
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "image_file_id")
    private ImageFile imageFile;

    public Artist(String name, LocalDate born, String nationality, ImageFile imageFile) {
        this.name = name;
        this.born = born;
        this.nationality = nationality;
        this.imageFile = imageFile;
    }

    public void update(String name, LocalDate born, String nationality, ImageFile imageFile) {
        this.name = name;
        this.born = born;
        this.nationality = nationality;
        this.imageFile = imageFile;
    }

    public ImageFile getImageFile() {
        return imageFile;
    }
}