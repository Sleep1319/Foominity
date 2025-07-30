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

    Optional<Magazine> findByMainNoticeTrue();
}
