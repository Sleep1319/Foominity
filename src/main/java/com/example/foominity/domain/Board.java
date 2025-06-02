package com.example.foominity.domain;

import java.lang.reflect.Member;

import com.fasterxml.jackson.databind.JsonSerializable.Base;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Board extends BaseEntity {

    // test

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "member_id")
    private Member memberId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

}
