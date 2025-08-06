package com.example.foominity.exception;

public class NoPendingNewsException extends RuntimeException {
    public NoPendingNewsException() {
        super("등록되지 않은 새 뉴스가 없습니다.");
    }
}
