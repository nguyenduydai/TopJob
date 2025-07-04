
package com.nguyenduydai.TopJob.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
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
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.BlogService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping("/blogs")
    @ApiMessage("create a blog")
    public ResponseEntity<Blog> createBlog(@Valid @RequestBody Blog blog) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.blogService.handleCreateBlog(blog));
    }

    @PutMapping("/blogs")
    public ResponseEntity<Blog> updateBlog(@Valid @RequestBody Blog postBlog) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.OK).body(this.blogService.handleUpdateBlog(postBlog));
    }

    @DeleteMapping("/blogs/{id}")
    @ApiMessage("delete blog")
    public ResponseEntity<ResString> deleteBlog(@PathVariable("id") long id) throws IdInvalidException {
        Blog currBlog = this.blogService.fetchBlogById(id);
        if (currBlog == null)
            throw new IdInvalidException("blog id = " + currBlog.getId() + "khong ton tai");
        this.blogService.handleDeleteBlog(id);
        ResString res = new ResString("delete success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/blogs/{id}")
    @ApiMessage("fetch blog by id")
    public ResponseEntity<Blog> getBlogById(@PathVariable("id") long id) {
        Blog blog = this.blogService.fetchBlogById(id);
        return ResponseEntity.ok(blog);
    }

    @GetMapping("/blogs")
    @ApiMessage("fetch all blog")
    public ResponseEntity<ResultPaginationDTO> getAllEntityBlog(@Filter Specification<Blog> spec, Pageable pageable) {

        return ResponseEntity.ok(this.blogService.fetchAllBlog(spec, pageable));
    }

}
