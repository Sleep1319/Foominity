package com.example.foominity.repository.notice;

import com.example.foominity.domain.notice.Notice;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    Page<Notice> findAll(Pageable pageable);

    Optional<Notice> findById(Long id);

    Optional<List<Notice>> findTop4ByOrderByDesc();
}
