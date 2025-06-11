package com.example.foominity.service.notice;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.domain.notice.Notice;
import com.example.foominity.dto.notice.NoticeRequest;
import com.example.foominity.dto.notice.NoticeResponse;
import com.example.foominity.dto.notice.NoticeUpdateRequest;
import com.example.foominity.exception.NotFoundNoticeException;
import com.example.foominity.repository.notice.NoticeRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public Page<NoticeResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC, "id"));
        Page<Notice> notices = noticeRepository.findAll(pageable);

        List<NoticeResponse> noticeResponseList = notices.stream()
                .map(notice -> new NoticeResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getContent()))
                .toList();
        return new PageImpl<>(noticeResponseList, pageable, notices.getTotalElements());
    }

    public NoticeResponse findByID(Long id) {
        Notice notice = noticeRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent());
    }

    @Transactional
    public void createNotice(NoticeRequest req) {
        noticeRepository.save(req.toEntity(req));
    }

    @Transactional
    public void deleteNotice(Long id) {
        noticeRepository.delete(noticeRepository.findById(id).orElseThrow(NotFoundNoticeException::new));
    }

}
