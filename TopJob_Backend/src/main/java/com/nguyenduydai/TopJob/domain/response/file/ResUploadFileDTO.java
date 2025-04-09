package com.nguyenduydai.TopJob.domain.response.file;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ResUploadFileDTO {
    private String fileName;
    private Instant uploadAt;
}
