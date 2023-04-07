package com.srm.machinemonitor.Configs;

import com.srm.machinemonitor.Filters.RateLimitingFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimiterConfig {

    @Bean
    public FilterRegistrationBean<RateLimitingFilter> rateLimitFilterRegistration() {
        FilterRegistrationBean<RateLimitingFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new RateLimitingFilter());
        registration.addUrlPatterns("/api/setter/data"); // Change this to the URL pattern for your API
        registration.setName("rateLimitFilterDataSetter");
        return registration;
    }
}
