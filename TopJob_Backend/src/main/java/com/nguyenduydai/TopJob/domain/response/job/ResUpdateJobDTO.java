package com.nguyenduydai.TopJob.domain.response.job;

import java.time.Instant;
import java.util.List;

import com.nguyenduydai.TopJob.util.constant.LevelEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResUpdateJobDTO {
    private long id;

    private String name;

    private String description;

    private String level;

    private String location;

    private double salary;

    private int quantity;

    private boolean active;

    private Instant startDate;

    private Instant endDate;

    private String updatedBy;

    private Instant updatedAt;
    private List<String> skills;
}
