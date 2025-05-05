package com.nguyenduydai.TopJob.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {
    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = { "/", "/api/v1/auth/**", "/storage/**",
                "/api/v1/companies/**", "/api/v1/jobs/**", "/api/v1/skills/**", "/api/v1/blogs/**",
                "/api/v1/files/**", "/api/v1/resumes/**", "/api/v1/subscribers/**", "/api/v1/email/**",
                "/api/v1/users/**", "/api/v1/roles/**", "/api/v1/users/changepassword/**", "/api/v1/jobsbycompany/**",
                "/api/v1/jobrecommendation" };
        registry.addInterceptor(getPermissionInterceptor())
                .excludePathPatterns(whiteList);
    };

}
