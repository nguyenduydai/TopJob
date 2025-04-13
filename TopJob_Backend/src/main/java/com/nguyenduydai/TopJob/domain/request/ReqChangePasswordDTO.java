package com.nguyenduydai.TopJob.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePasswordDTO {
    @NotBlank(message = "password cũ không được để trống")
    private String oldPassword;
    @NotBlank(message = "password mới không được để trống")
    private String newPassword;
}
