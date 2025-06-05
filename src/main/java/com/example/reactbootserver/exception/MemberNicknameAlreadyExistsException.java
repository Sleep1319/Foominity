package com.example.reactbootserver.exception;

public class MemberNicknameAlreadyExistsException extends RuntimeException{

    public MemberNicknameAlreadyExistsException() { super(); }
    public MemberNicknameAlreadyExistsException(String message) {
        super(message);
    }
}
