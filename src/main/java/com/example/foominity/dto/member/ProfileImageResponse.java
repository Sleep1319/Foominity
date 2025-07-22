package com.example.foominity.dto.member;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// null 필드는 JSON에 포함되지 않도록
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileImageResponse {
    private String imageUrl; // 업로드/변경 시 반환
}
