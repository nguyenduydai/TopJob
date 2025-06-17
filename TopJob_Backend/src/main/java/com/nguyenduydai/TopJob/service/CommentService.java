package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Blog;
import com.nguyenduydai.TopJob.domain.entity.Comment;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqCommentDTO;
import com.nguyenduydai.TopJob.domain.response.comment.ResCommentDTO;
import com.nguyenduydai.TopJob.repository.BlogRepository;
import com.nguyenduydai.TopJob.repository.CommentRepository;
import com.nguyenduydai.TopJob.repository.UserRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final BlogService blogService;
    private final UserService userService;

    public CommentService(CommentRepository commentRepository, BlogService blogService, UserService userService) {
        this.commentRepository = commentRepository;
        this.blogService = blogService;
        this.userService = userService;
    }

    public Comment handleCreateComment(ReqCommentDTO reqCommentDTO) {
        Blog blog = blogService.fetchBlogById(reqCommentDTO.getBlogId());
        User user = userService.fetchUserById(reqCommentDTO.getUserId());
        Comment comment = new Comment();
        comment.setContent(reqCommentDTO.getContent());
        comment.setLikeCount(reqCommentDTO.getLikeCount());
        comment.setBlog(blog);
        comment.setUser(user);
        if (reqCommentDTO.getParentId() != null) {
            Comment parent = commentRepository.findById(reqCommentDTO.getParentId()).orElseThrow();
            comment.setParent(parent);
        }
        return this.commentRepository.save(comment);
    }

    public void handleDeleteComment(long id) {
        this.commentRepository.deleteById(id);
    }

    public Comment fetchCommentById(long id) {
        Optional<Comment> c = this.commentRepository.findById(id);
        if (c.isPresent())
            return c.get();
        return null;
    }

    public List<ResCommentDTO> getCommentsByBlog(long id) {
        // List<Comment> topLevelComments =
        // commentRepository.findByBlogIdOrderByCreatedAtDesc(id);
        List<Comment> topLevelComments = commentRepository.findByBlogIdAndParentIsNullOrderByCreatedAtDesc(id);
        List<ResCommentDTO> result = topLevelComments.stream()
                .map(comment -> toDTO(comment, 0))
                .collect(Collectors.toList());
        return result;
    }

    public Comment handleUpdateComment(long id) {
        Comment comment = this.fetchCommentById(id);
        comment.setLikeCount(comment.getLikeCount() + 1);
        return this.commentRepository.save(comment);
    }

    public ResCommentDTO toDTO(Comment comment, int depth) {
        if (depth > 3)
            return null; // Giới hạn tối đa 3 cấp phản hồi

        ResCommentDTO dto = new ResCommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setLikeCount(comment.getLikeCount());
        dto.setBlog(comment.getBlog());
        dto.setUser(comment.getUser());
        dto.setCreatedAt(comment.getCreatedAt());

        List<ResCommentDTO> childReplies = comment.getReplies().stream()
                .map(reply -> toDTO(reply, depth + 1))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        dto.setReplies(childReplies);
        return dto;
    }
}
