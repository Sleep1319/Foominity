package com.example.foominity.exception;

public class MemberEmailAlreadyExistsException extends RuntimeException{

    public MemberEmailAlreadyExistsException() {
        super();
    }
    public MemberEmailAlreadyExistsException(String message) {
        super(message);
    }
}
