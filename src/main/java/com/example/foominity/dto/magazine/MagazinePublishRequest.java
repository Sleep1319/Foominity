package com.example.foominity.dto.magazine;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MagazinePublishRequest {

    // 최종 제목 (translatedTitle 그대로 사용)
    private String title;
    // 최종 요약문(관리자가 추가·수정 가능)
    private String summary;
    // 최종 본문(관리자가 필요 시 수정)
    private String content;
    // 최종 핵심 문장 리스트(컨펌 혹은 수정된 keyPoints)
    private List<String> keyPoints;

    private MultipartFile image;
    private String imagePath;
}
