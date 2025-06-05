package com.example.reactbootserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ReactBootServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReactBootServerApplication.class, args);
    }

}
