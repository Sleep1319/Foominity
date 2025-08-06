package com.example.foominity.dto.magazine;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingMagazine {

    // RSS 원제목
    private String originalTitle;
    // 번역된 제목
    private String translatedTitle;
    // RSS 피드에서 받은 요약 텍스트
    private String summary;
    // 번역된 전체 본문
    private String translatedContent;
    // AI가 미리 뽑아 온 핵심 문장 후보 2개
    private List<String> keyPoints;
    // 이미지 URL
    private String imageUrl;
    // 원문 링크
    private String originalUrl;
    // 발행일
    private Date publishedDate;
}
