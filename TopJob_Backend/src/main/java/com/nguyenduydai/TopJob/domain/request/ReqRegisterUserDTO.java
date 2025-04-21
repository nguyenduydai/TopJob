package com.nguyenduydai.TopJob.domain.request;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.nguyenduydai.TopJob.util.constant.GenderEnum;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqRegisterUserDTO {
    private String name;
    private String phone;
    private String email;
    private String password;
    private int age;
    private GenderEnum gender;
    private String address;
    private String companyName;
    private String companyAddress;
    private long roleId;
}
