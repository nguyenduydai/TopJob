package com.nguyenduydai.TopJob.domain.response.comment;

import java.time.Instant;
import java.util.List;

import com.nguyenduydai.TopJob.domain.entity.Blog;
import com.nguyenduydai.TopJob.domain.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResCommentDTO {

    private Long id;
    private String content;
    private int likeCount;
    private Blog blog;
    private User user;
    private Instant createdAt;
    private List<ResCommentDTO> replies;
}