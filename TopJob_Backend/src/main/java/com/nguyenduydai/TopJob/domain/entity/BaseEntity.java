package com.nguyenduydai.TopJob.domain.entity;

import java.time.Instant;

import org.apache.catalina.security.SecurityUtil;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String createdBy;

    private String updatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        // this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
        // ? SecurityUtil.getCurrentUserLogin().get()
        // : "";
        // this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        // this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
        // ? SecurityUtil.getCurrentUserLogin().get()
        // : "";
        // this.updatedAt = Instant.now();
    }
}
