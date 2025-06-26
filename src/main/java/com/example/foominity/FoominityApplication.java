package com.example.foominity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // createdDate를 가져오기 위해서 추가
public class FoominityApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoominityApplication.class, args);
	}

}
