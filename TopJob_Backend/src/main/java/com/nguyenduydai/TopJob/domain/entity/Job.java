package com.nguyenduydai.TopJob.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nguyenduydai.TopJob.util.constant.LevelEnum;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job extends BaseEntity {
    @NotBlank(message = "name khong duoc de trong")
    private String name;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private LevelEnum level;
    private String location;
    private double salary;
    private int quantity;
    private boolean active;
    private Instant startDate;
    private Instant endDate;

    private String jobEnvironment;
    private String educationRequirement;
    private String ageRequirement;
    private String experienceRequirement;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "jobs" })
    @JoinTable(name = "job_skill", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    List<Skill> skills;

    @OneToMany(mappedBy = "job", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Resume> resumes;

    @OneToMany(mappedBy = "job", fetch = FetchType.LAZY)
    @JsonIgnore
    List<JobRecommendation> jobRecommendations;

    @OneToMany(mappedBy = "job", fetch = FetchType.LAZY)
    @JsonIgnore
    List<TalentCandidate> talentCandidate;

    // chưa dùng đến :)))
    private int viewCount;
    private String jobType;
    private String jobRequirement;
    private String position;
}
