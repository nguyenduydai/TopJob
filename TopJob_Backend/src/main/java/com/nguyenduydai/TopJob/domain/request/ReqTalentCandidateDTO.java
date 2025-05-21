package com.nguyenduydai.TopJob.domain.request;

import java.util.List;

import com.nguyenduydai.TopJob.domain.entity.Skill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqTalentCandidateDTO {
    private List<Skill> skills;
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

}