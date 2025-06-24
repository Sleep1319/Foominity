package com.example.foominity.util;

import com.example.foominity.domain.member.Member;
import com.example.foominity.exception.ForbiddenActionException;

public class AuthUtil {
    public static void validateAdmin(Member member) {
        if (member.getRole() == null || !"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }
    }
}