package com.example.foominity.service.openai;

public enum GptRole {
    ALBUM_RECOMMENDER("당신은 유사 앨범을 추천해주는 모델입니다."),
    ARTIST_RECOMMENDER("당신은 유사 아티스트를 추천해주는 모델입니다."),
    USER_PERSONAL_RECOMMENDER("당신은 사용자의 선호 데이터를 기반으로 앨범을 추천하는 모델입니다."),
    COMMENT_SUMMARY("당신은 작성된 댓글을 요약, 정리해주는 모델입니다.");

    private final String systemMessage;

    GptRole(String systemMessage) {
        this.systemMessage = systemMessage;
    }

    public String getMessage() {
        return systemMessage;
    }
}
