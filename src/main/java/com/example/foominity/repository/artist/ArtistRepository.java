package com.example.foominity.repository.artist;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.artist.Artist;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

}
