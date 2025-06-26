package com.example.foominity.service.category;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.dto.category.ReviewCategoryResponse;
import com.example.foominity.repository.category.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategory() {

        return categoryRepository.findAll().stream().map(CategoryResponse::fromEntity).toList();
    }

}
