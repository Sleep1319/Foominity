package com.example.foominity.repository.artist;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.foominity.domain.artist.Artist;
import com.example.foominity.domain.board.Review;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

        Optional<Artist> findByNameIgnoreCase(String name);

        @Query("""
                            SELECT ac.artist
                            FROM ArtistCategory ac
                            JOIN ac.category c
                            GROUP BY ac.artist
                            HAVING COUNT(DISTINCT CASE WHEN c.categoryName IN :names THEN c.categoryName END) = :size
                        """)
        List<Artist> findByCategories(@Param("names") List<String> names, @Param("size") long size);

        @Query("""
                        SELECT a
                        FROM Artist a
                        WHERE (:search IS NULL OR :search = ''
                               OR LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')))
                        """)
        Page<Artist> findByNameContainingIgnoreCase(@Param("search") String search, Pageable pageable);

        @Query("""
                            SELECT a
                            FROM ArtistCategory ac
                            JOIN ac.artist a
                            JOIN ac.category c
                            WHERE c.categoryName IN :names
                            GROUP BY a
                            ORDER BY COUNT(DISTINCT c.id) DESC, a.id DESC
                        """)
        List<Artist> findByAnyCategoryNames(@Param("names") List<String> names);

        @Query("""
                        SELECT DISTINCT a
                        FROM Artist a
                        LEFT JOIN ArtistCategory ac ON ac.artist = a
                        LEFT JOIN Category c ON ac.category = c
                        WHERE (:search IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')))
                        AND (:#{#categories == null || #categories.isEmpty()} = TRUE OR c.categoryName IN :categories)
                        """)
        Page<Artist> findFilteredArtists(
                        @Param("search") String saearch,
                        @Param("categories") List<String> categories,
                        Pageable pageable);
}
