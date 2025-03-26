package com.nguyenduydai.TopJob.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
public class Blog extends BaseEntity {

    private String title;
    private String content;
    private int likeCount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
