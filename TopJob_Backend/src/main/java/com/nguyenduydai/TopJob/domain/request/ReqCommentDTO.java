package com.nguyenduydai.TopJob.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCommentDTO {
    private Long blogId;
    private Long userId;
    private Long parentId;

    private String content;
    private int likeCount;

}