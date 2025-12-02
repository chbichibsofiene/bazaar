package com.bazar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ECommeceMultivendorApplication {

	public static void main(String[] args) {
		SpringApplication.run(ECommeceMultivendorApplication.class, args);
	}

}
