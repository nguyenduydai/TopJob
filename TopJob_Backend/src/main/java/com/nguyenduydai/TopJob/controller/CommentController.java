package com.nguyenduydai.TopJob.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import com.nguyenduydai.TopJob.domain.entity.Blog;
import com.nguyenduydai.TopJob.domain.entity.Comment;
import com.nguyenduydai.TopJob.domain.request.ReqCommentDTO;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.comment.ResCommentDTO;
import com.nguyenduydai.TopJob.service.BlogService;
import com.nguyenduydai.TopJob.service.CommentService;
import com.nguyenduydai.TopJob.service.UserService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comments")
    @ApiMessage("create a comment")
    public ResponseEntity<Comment> createComment(@Valid @RequestBody ReqCommentDTO reqCommentDTO)
            throws IdInvalidException {
        Comment comment = this.commentService.handleCreateComment(reqCommentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @DeleteMapping("/comments/{id}")
    @ApiMessage("delete comment")
    public ResponseEntity<ResString> deleteComment(@PathVariable("id") long id) throws IdInvalidException {
        Comment currComment = this.commentService.fetchCommentById(id);
        if (currComment == null)
            throw new IdInvalidException("comment id = " + currComment.getId() + "khong ton tai");
        this.commentService.handleDeleteComment(id);
        ResString res = new ResString("delete success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/comments/blog/{blogId}")
    public ResponseEntity<List<ResCommentDTO>> getCommentsByBlog(@PathVariable long blogId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.commentService.getCommentsByBlog(blogId));
    }

    @PutMapping("/comments/like/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable("commentId") long commentId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.commentService.handleUpdateComment(commentId));
    }
    // @GetMapping("/comments/{id}")
    // @ApiMessage("fetch comment by id")
    // public ResponseEntity<Comment> getCommentById(@PathVariable("id") long id) {
    // Comment comment = this.commentService.fetchCommentById(id);
    // return ResponseEntity.ok(comment);
    // }
    // @PutMapping("/comments")
    // public ResponseEntity<Comment> updateBlog(@Valid @RequestBody Comment
    // comment) throws IdInvalidException {
    // return
    // ResponseEntity.status(HttpStatus.OK).body(this.blogService.handleUpdateComment(comment));
    // }

    // @GetMapping("/comments")
    // @ApiMessage("fetch all comments")
    // public ResponseEntity<ResultPaginationDTO> getAllEntityBlog(@Filter
    // Specification<Blog> spec, Pageable pageable) {

    // return ResponseEntity.ok(this.blogService.fetchAllComment(spec, pageable));
    // }

}
