package com.example.foominity.domain;

import java.lang.reflect.Member;

import jakarta.persistence.JoinColumn;

public class BoardCategoty {

    @JoinColumn(name = "review_id")
    private Long reviewId;

    @JoinColumn(name = "category_id")
    private Category categotyId;

    @JoinColumn(name = "member_id")
    private Member memberId;
}
