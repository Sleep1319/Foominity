package com.example.foominity.repository.artist;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.foominity.domain.artist.Artist;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Optional<Artist> findByNameIgnoreCase(String name);

    @Query("""
            SELECT DISTINCT ac.artist
            FROM ArtistCategory ac
            JOIN ac.category c
            WHERE c.categoryName IN :names
            """)
    List<Artist> findByCategories(@Param("names") List<String> names);
}
