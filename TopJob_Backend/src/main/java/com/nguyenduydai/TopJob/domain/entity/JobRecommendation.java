package com.nguyenduydai.TopJob.domain.entity;

import java.time.Instant;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "job_recommendations")
@Getter
@Setter
public class JobRecommendation extends BaseEntity {

    private double matchScore;
    private String note;
    private Instant recommendedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
}