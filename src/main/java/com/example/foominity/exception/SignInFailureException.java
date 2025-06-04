package com.example.foominity.exception;

public class SignInFailureException extends RuntimeException {
    public SignInFailureException(String message) {
        super(message);
    }
}
