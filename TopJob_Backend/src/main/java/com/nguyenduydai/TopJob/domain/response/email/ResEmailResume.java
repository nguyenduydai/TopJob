package com.nguyenduydai.TopJob.domain.response.email;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResEmailResume {
    private String nameUser;
    private String jobName;
    private String companyName;
    private String emailHr;
    private String message;

}