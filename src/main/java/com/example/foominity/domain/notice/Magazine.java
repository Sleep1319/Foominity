package com.example.foominity.domain.notice;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.image.ImageFile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "magazine")
public class Magazine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private boolean mainNotice = false;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "image_file_id")
    private ImageFile imageFile;

    @ElementCollection
    @CollectionTable(name = "magazine_key_points", joinColumns = @JoinColumn(name = "magazine_id"))
    @Column(name = "key_point", nullable = false)
    private List<String> keyPoints = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String originalUrl;

    @Column(name = "published_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date publishedDate;

    public Magazine(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void changeNotice() {
        this.mainNotice = true;
    }

    public void cancelNotice() {
        this.mainNotice = false;
    }

    public void setImageFile(ImageFile imageFile) {
        this.imageFile = imageFile;
    }

    public void setKeyPoints(List<String> keyPoints) {
        this.keyPoints = keyPoints;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public void setPublishedDate(Date publishedDate) {
        this.publishedDate = publishedDate;
    }
}
