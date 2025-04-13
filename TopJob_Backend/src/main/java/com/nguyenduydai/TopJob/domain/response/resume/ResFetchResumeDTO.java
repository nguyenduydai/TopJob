package com.nguyenduydai.TopJob.domain.response.resume;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.nguyenduydai.TopJob.util.constant.ResumeStateEnum;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResFetchResumeDTO {
    private long id;
    private String email;
    private String url;
    private ResumeStateEnum status;
    private String createdBy;

    private String updatedBy;

    private Instant createdAt;

    private Instant updatedAt;

    private JobResume job;
    private UserResume user;
    private String companyName;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JobResume {
        private long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResume {
        private long id;
        private String name;
    }

}
