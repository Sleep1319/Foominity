//package com.example.foominity.domain.category;
//
//import com.example.foominity.domain.board.Review;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.ToString;
//
//@NoArgsConstructor
//@Getter
//@ToString
//@Entity
//public class BoardCategory {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @JoinColumn(name = "review_id")
//    private Review reviewId;
//
//    @JoinColumn(name = "category_id")
//    private Category categoryId;
//
//}
