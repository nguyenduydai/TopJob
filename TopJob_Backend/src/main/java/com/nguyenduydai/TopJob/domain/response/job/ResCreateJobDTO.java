package com.nguyenduydai.TopJob.domain.response.job;

import lombok.Getter;
import lombok.Setter;
import com.nguyenduydai.TopJob.util.constant.LevelEnum;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ResCreateJobDTO {

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

    private String createdBy;

    private Instant createdAt;
    private List<String> skills;
}
