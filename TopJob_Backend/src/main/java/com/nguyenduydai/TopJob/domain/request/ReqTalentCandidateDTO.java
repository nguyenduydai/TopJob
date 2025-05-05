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
    private String address;
    private List<Skill> skills;
    private String education;
    private String age;
    private String experience;
    private boolean activity;

}