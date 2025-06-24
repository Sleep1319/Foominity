package com.example.foominity.domain.artist;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.board.Review;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
@Entity
public class AlbumArtist extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "review_id")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    public AlbumArtist(Review review, Artist artist) {
        this.review = review;
        this.artist = artist;
    }

}
