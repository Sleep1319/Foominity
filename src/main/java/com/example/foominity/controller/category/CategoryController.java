package com.example.foominity.controller.category;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.service.category.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/api/categories")
    public ResponseEntity<?> findAllCategories() {
        List<CategoryResponse> res = categoryService.getCategory();
        return ResponseEntity.ok(res);
    }

}
