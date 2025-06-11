//package com.example.foominity.dto.board;
//
//import com.example.foominity.domain.member.Member;
//import com.example.reactbootserver.domain.Member;
//import com.example.reactbootserver.domain.board.Board;
//import jakarta.validation.constraints.NotNull;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class BoardCreateRequest {
//
//    @NotNull
//    private Long memberId;
//
//    @NotNull
//    private String title;
//
//    @NotNull
//    private String content;
//
//    public Board toEntity(BoardCreateRequest req, Member member) {
//        return new Board(req.getTitle(), req.title, member);
//    }
//}
