package com.nguyenduydai.TopJob.domain.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "talent_candidates")
@Getter
@Setter
public class TalentCandidate extends BaseEntity {

    private Double compatibilityScore;
    private String note;
    private Instant recommendedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
