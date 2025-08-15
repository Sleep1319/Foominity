package com.example.foominity.domain.report;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.image.ImageFile;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Report extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_type")
    private String targetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReportType type;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "member_id")
    private Long memberId;

    @Column
    private String nickname;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(name = "report_image_file", joinColumns = @JoinColumn(name = "report_id"), inverseJoinColumns = @JoinColumn(name = "image_file_id"))
    @OrderColumn(name = "sort_order") // 정렬 저장
    private List<ImageFile> images = new ArrayList<>();

    public Report(String title, String reason, ReportType type, Long targetId, String targetType, Long memberId,
            String nickname) {
        this.title = title;
        this.reason = reason;
        this.type = type;
        this.targetId = targetId;
        this.targetType = targetType;
        this.memberId = memberId;
        this.nickname = nickname;
        this.status = ReportStatus.PENDING;  
    }

    public void updateStatus(ReportStatus status) {
        this.status = status;
    }

    public List<String> getImagePaths() {
        return images.stream()
                .map(ImageFile::getSavePath)
                .toList();
    }

}
