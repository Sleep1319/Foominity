package com.example.foominity.domain.board;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.artist.Artist;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 앨범명
    @Column(nullable = false)
    private String title;

    // 발매일
    @Column(nullable = false)
    private LocalDate released;

    @ElementCollection
    @CollectionTable(name = "review_tracklist", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "track_name")
    private List<String> tracklist = new ArrayList<>();

    public Review(String title, LocalDate released, List<String> tracklist) {
        this.title = title;
        this.released = released;
        this.tracklist = tracklist;
    }

    public void update(String title, LocalDate released, List<String> tracklist) {
        this.title = title;
        this.released = released;
        this.tracklist = tracklist;
    }
}
