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
public class ReqUserRequirementDTO {
    private String location;
    private double salary;
    private List<Skill> skills;
    private boolean quality;
    private String level;

    private String jobEnvironment;
    private String educationRequirement;
    private int ageRequirement;
    private String experienceRequirement;

}
