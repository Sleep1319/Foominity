package com.example.foominity.domain.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, name = "required_point")
    private int requiredPoint;

    // Role 객체 쓸 수도 있으니까 생성자 생성
    public Role(String name, int requiredPoint) {
        this.name = name;
        this.requiredPoint = requiredPoint;
    }
}
