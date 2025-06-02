package com.example.foominity.repository.notice;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

}
