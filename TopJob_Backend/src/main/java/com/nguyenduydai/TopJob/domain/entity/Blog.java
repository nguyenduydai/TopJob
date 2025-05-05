package com.nguyenduydai.TopJob.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
public class Blog extends BaseEntity {
    private String title;
    private int likeCount;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;
    private String thumbnail;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
