package com.example.foominity.repository.category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.category.ArtistCategory;

public interface ArtistCategoryRepository extends JpaRepository<ArtistCategory, Long> {
    List<ArtistCategory> findByArtistId(Long artistId);

    void deleteByArtistId(Long artistId);
}
