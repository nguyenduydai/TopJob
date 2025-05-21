package com.nguyenduydai.TopJob.domain.entity;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "talent_candidates")
@Getter
@Setter
public class TalentCandidate extends BaseEntity {
    private Double compatibilityScore;

    // @OneToMany(mappedBy = "talentCandidate", fetch = FetchType.LAZY)
    // @JsonIgnore
    // private List<Skill> skills;
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "talentCandidates" })
    @JoinTable(name = "talent_candidate_skill", joinColumns = @JoinColumn(name = "talent_candidate_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    List<Skill> skills;
    private Double multiplierSkills;

    private String address;
    private Double multiplierAddress;

    private String education;
    private Double multiplierEducation;

    private String age;
    private Double multiplierAge;

    private String experience;
    private Double multiplierExperience;

    private boolean activity;
    private Double multiplierActivity;

    private String gender;
    private Double multiplierGender;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
}
