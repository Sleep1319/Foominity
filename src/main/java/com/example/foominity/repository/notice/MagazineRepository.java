package com.example.foominity.repository.notice;

import com.example.foominity.domain.notice.Magazine;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MagazineRepository extends JpaRepository<Magazine, Long> {

    Page<Magazine> findAll(Pageable pageable);

    Optional<Magazine> findById(Long id);

    Optional<List<Magazine>> findTop4ByOrderByIdDesc();

    // 원본 URL 존재 여부 확인 (중복 방지용)
    boolean existsByOriginalUrl(String originalUrl);
}
