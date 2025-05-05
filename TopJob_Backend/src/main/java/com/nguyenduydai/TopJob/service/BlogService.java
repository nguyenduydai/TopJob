package com.nguyenduydai.TopJob.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.nguyenduydai.TopJob.domain.entity.Blog;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.BlogRepository;

@Service
public class BlogService {
    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public Blog handleCreateBlog(Blog c) {
        return this.blogRepository.save(c);
    }

    public Blog handleUpdateBlog(Blog blog) {
        Blog blogInDb = this.fetchBlogById(blog.getId());
        if (blog.getContent() != null)
            blogInDb.setContent(blog.getContent());
        if (blog.getThumbnail() != null)
            blogInDb.setThumbnail(blog.getThumbnail());
        if (blog.getTitle() != null)
            blogInDb.setTitle(blog.getTitle());
        if (blog.getLikeCount() != -1)
            blogInDb.setLikeCount(blog.getLikeCount());

        return this.blogRepository.save(blogInDb);
    }

    public void handleDeleteBlog(long id) {
        Optional<Blog> s = this.blogRepository.findById(id);
        Blog currblog = s.get();
        this.blogRepository.delete(currblog);
    }

    public Blog fetchBlogById(long id) {
        Optional<Blog> blog = this.blogRepository.findById(id);
        if (blog.isPresent())
            return blog.get();
        return null;
    }

    public ResultPaginationDTO fetchAllBlog(Specification<Blog> spec, Pageable pageable) {
        Page<Blog> page = this.blogRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);
        rs.setResult(page.getContent());

        return rs;
    }

}
