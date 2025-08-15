package com.example.foominity.handler;

import com.example.foominity.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.awt.*;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MemberEmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailExistsException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "중복된 이메일 입니다"));
    }

    @ExceptionHandler(MemberNicknameAlreadyExistsException.class)
    public ResponseEntity<?> handleNicknameExistsException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "중복된 닉네임입니다."));
    }

    @ExceptionHandler(NotFoundRoleIdException.class)
    public ResponseEntity<?> handleNotFoundRoleIdException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "저장된 등급 정보가 없습니다."));
    }

    @ExceptionHandler(SignInFailureException.class)
    public ResponseEntity<?> handleSignInFailureException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "이메일 또는 비밀번호가 다릅니다."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", message));
    }

    @ExceptionHandler(NotFoundBoardException.class)
    public ResponseEntity<?> handleNotFoundBoardException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "해당 게시글을 찾을 수 없습니다."));
    }

    @ExceptionHandler(NotLoginException.class)
    public ResponseEntity<?> handleNotLoginException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "로그인 상태가 아닙니다."));
    }

    @ExceptionHandler(ForbiddenActionException.class)
    public ResponseEntity<?> handleForbiddenActionException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "요청 권한이 없습니다."));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "유효하지 않는 토큰입니다."));
    }

    @ExceptionHandler(NotFoundImageException.class)
    public ResponseEntity<?> handleImageUploadException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "이미지 업로드 실패."));
    }

    @ExceptionHandler(NotFoundPostCategory.class)
    public ResponseEntity<?> handleNotFoundPostCategory() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "잘못된 종류의 게시판 요청 입니다."));
    }

    @ExceptionHandler(VerificationCodeExpiredException.class)
    public ResponseEntity<?> handleExpired(VerificationCodeExpiredException e) {
        return ResponseEntity.status(410).body(Map.of("error", "코드가 만료되었습니다."));
    }

    @ExceptionHandler(VerificationCodeMismatchException.class)
    public ResponseEntity<?> handleMismatch(VerificationCodeMismatchException e) {
        return ResponseEntity.badRequest().body(Map.of("error", "코드가 일치하지 않습니다."));
    }

    @ExceptionHandler(VerificationNotRequestedException.class)
    public ResponseEntity<?> handleNotRequested(VerificationNotRequestedException e) {
        return ResponseEntity.status(404).body(Map.of("error", "인증요청 기록이 없습니다."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("error", "요청 처리 중 오류 발생"));
    }

    @ExceptionHandler(AlreadyLikedException.class)
    public ResponseEntity<?> handleAlreadyLikedException(AlreadyLikedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }
}
