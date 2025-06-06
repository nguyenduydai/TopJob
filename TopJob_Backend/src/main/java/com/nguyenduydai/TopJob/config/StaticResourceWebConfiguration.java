package com.nguyenduydai.TopJob.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceWebConfiguration implements WebMvcConfigurer {
    @Value("${jobhunter.upload-file.base-uri}")
    private String baseURI;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/storage/**", "/static/**")
                .addResourceLocations(baseURI)
                .addResourceLocations("classpath:/static/");
    }

}
