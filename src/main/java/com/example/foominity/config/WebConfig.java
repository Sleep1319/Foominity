package com.example.foominity.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    // 서버 올리면 필요 없을 수도
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/chat/**")
                .allowedOrigins("http://localhost:8084")
                .allowedMethods("POST");
    }
}
