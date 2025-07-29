package com.example.foominity.dto.magazine;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MagazineUpdateRequest {

    private String title;

    private String content;
}
