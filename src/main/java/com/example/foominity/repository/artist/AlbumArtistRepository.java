package com.example.foominity.repository.artist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.artist.AlbumArtist;

public interface AlbumArtistRepository extends JpaRepository<AlbumArtist, Long> {

    List<AlbumArtist> findByReviewId(Long reviewId);

    List<AlbumArtist> findByArtistId(Long artistId);

    void deleteByReviewId(Long reviewId);
}
