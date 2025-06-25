package com.example.foominity.domain.image;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class ImageFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_name")
    private String originalName;

    @Column(name = "save_path")
    private String savePath;

    public ImageFile(String originalName, String savePath) {
        this.originalName = originalName;
        this.savePath = savePath;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public void setSavePath(String savePath) {
        this.savePath = savePath;
    }
}
