package com.example.reactbootserver.exception;

public class SignInFailureException extends RuntimeException {
    public SignInFailureException(String message) {
        super(message);
    }
}
