package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchTracksResponse {
    private List<SearchTrack> items;
    private int total;
}
