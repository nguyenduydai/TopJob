package com.nguyenduydai.TopJob.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.nguyenduydai.TopJob.domain.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    List<Comment> findByBlogIdOrderByCreatedAtDesc(Long blogId);

    List<Comment> findByBlogIdAndParentIsNullOrderByCreatedAtDesc(Long blogId);
}
