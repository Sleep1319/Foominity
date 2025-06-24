package com.example.foominity.domain.artist;

import java.time.LocalDate;

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

    public Artist(String name, LocalDate born, String nationality) {
        this.name = name;
        this.born = born;
        this.nationality = nationality;
    }

    public void update(String name) {
        this.name = name;
    }
}