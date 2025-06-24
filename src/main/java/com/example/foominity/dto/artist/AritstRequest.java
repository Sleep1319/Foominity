package com.example.foominity.dto.artist;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AritstRequest {

    @NotBlank
    private String name;

    private List<Long> categoryIds;

    private LocalDate born;

    private String nationality;
}
