package com.example.foominity.config.social;

import java.util.Map;
import java.util.Objects;

public class KakaoUserInfo {
    private final Map<String, Object> attributes;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public String getId() {
        return attributes.get("id").toString();
    }

    public String getEmail() {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        return account.get("email").toString();
    }

    public String getName() {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");
        return profile.get("nickname").toString();
    }
}
