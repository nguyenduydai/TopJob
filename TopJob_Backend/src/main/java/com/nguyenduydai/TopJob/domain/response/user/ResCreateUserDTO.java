package com.nguyenduydai.TopJob.domain.response.user;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.nguyenduydai.TopJob.util.constant.GenderEnum;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResCreateUserDTO {
    private long id;
    private String name;
    private String email;
    private int age;
    private GenderEnum gender;
    private String address;
    private Instant createdAt;
    private CompanyUser companyUser;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class CompanyUser {
        private long id;
        private String name;
    }
}
