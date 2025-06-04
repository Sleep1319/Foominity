package com.example.foominity.service.notice;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.repository.notice.NoticeRepository;

@Transactional(readOnly = true)
@Service
public class NoticeService {

}
