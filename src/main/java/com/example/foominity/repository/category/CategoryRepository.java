package com.example.foominity.repository.category;

import com.example.foominity.domain.category.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
