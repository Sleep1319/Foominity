package com.example.foominity.domain.member;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.report.Report;
import com.example.foominity.domain.report.ReportComment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Table(name = "member")
@NoArgsConstructor
@Getter
@ToString
@Entity
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String password;

    @Column(name = "user_name")
    private String userName;

    @Column(unique = true)
    private String nickname;

    @Column(name = "social_type")
    private String socialType;

    @Column(name = "provider_id")
    private String providerId;

    // 연관 관계======================================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToOne(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Point point;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_image_id")
    private ImageFile profileImage;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<ReviewLike> reviewLike;

    // Like 엔티티 지울지 말지 정하기 (리뷰 코멘트에 해당하는 좋아요임)
    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<Like> like;

    // ===============================================================

    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<ReviewComment> reviewComment;

    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<Board> board;

    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<BoardComment> boardComment;

    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<Report> report;

    // @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    // private List<ReportComment> reportComment;

    // ================================================================
    public Member(String email, String password, String userName, String nickname, Role role) {
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.nickname = nickname;
        this.role = role;
    }

    public void setSocialProvider(String socialType, String providerId) {
        this.socialType = socialType;
        this.providerId = providerId;
    }

    // RoleService에 사용
    public void updateRole(Role newRole) {
        this.role = newRole;
    }

    // setter가 아닌 도메인 메서드 쓰는 이유
    // 닉네임 unique 라서 중복되면 안 되니까 setter 쓰면 안 됨
    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    // 프로필 사진 삭제 시 필요
    public ImageFile getProfileImage() {
        return profileImage;
    }

    // 프로필 사진 설정
    public void setProfileImage(ImageFile profileImage) {
        this.profileImage = profileImage;
    }

    public void setPassword(String encodedPassword) {
        this.password = encodedPassword;
    }

}
