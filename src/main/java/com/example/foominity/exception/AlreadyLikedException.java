package com.example.foominity.exception;

public class AlreadyLikedException extends RuntimeException {
    public AlreadyLikedException(String message) {
        super(message);
    }
}
