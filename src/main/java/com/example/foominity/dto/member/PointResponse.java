package com.example.foominity.dto.member;

import com.example.foominity.domain.member.Point;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointResponse {

    private Long id;

    private int totalPoint;

    // private int calPoint(Point point) {
    // return (point.getReviewCount() * 10) + (point.getLikeCount() * 2);
    // }

}
