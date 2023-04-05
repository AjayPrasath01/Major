package com.srm.machinemonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Collections;


@SpringBootApplication
@EnableScheduling
@EnableCaching
public class MachinemonitorApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(MachinemonitorApplication.class);
		if (args.length > 0) {
			app.setDefaultProperties(Collections.singletonMap("spring.datasource.url", args[0]));
			app.setDefaultProperties(Collections.singletonMap("spring.datasource.username", args[1]));
			app.setDefaultProperties(Collections.singletonMap("spring.datasource.password", args[2]));
		}
		app.run(args);
	}

}
