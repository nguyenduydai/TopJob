package com.nguyenduydai.TopJob.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResCreateResumeDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResFetchResumeDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResUpdateResumeDTO;
import com.nguyenduydai.TopJob.service.JobService;
import com.nguyenduydai.TopJob.service.ResumeService;
import com.nguyenduydai.TopJob.service.UserService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class ResumeController {
    @Autowired
    private FilterBuilder fb;
    @Autowired
    private FilterParser filterParser;
    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;

    private final ResumeService resumeService;
    private final UserService userService;
    private final JobService jobService;

    public ResumeController(ResumeService resumeService, UserService userService, JobService jobService) {
        this.resumeService = resumeService;
        this.jobService = jobService;
        this.userService = userService;
    }

    @PostMapping("/resumes")
    @ApiMessage("create a Resume")
    public ResponseEntity<ResCreateResumeDTO> createResume(@Valid @RequestBody Resume resume)
            throws IdInvalidException {
        if (this.resumeService.checkResumeExistByUserAndJob(resume)) {
            throw new IdInvalidException("user or Job not exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.resumeService.handleCreateResume(resume));
    }

    @PutMapping("/resumes")
    @ApiMessage("update Resume")
    public ResponseEntity<ResUpdateResumeDTO> updateResume(@RequestBody Resume postResume) throws IdInvalidException {
        Resume currResume = this.resumeService.fetchResumeById(postResume.getId());
        if (currResume == null)
            throw new IdInvalidException("Resume id = " + postResume.getId() + "khong ton tai");
        currResume.setStatus(postResume.getStatus());
        return ResponseEntity.status(HttpStatus.OK).body(this.resumeService.handleUpdateResume(postResume));
    }

    @DeleteMapping("/resumes/{id}")
    @ApiMessage("delete Resume")
    public ResponseEntity<String> deleteResume(@PathVariable("id") long id) throws IdInvalidException {
        Resume currResume = this.resumeService.fetchResumeById(id);
        if (currResume == null)
            throw new IdInvalidException("Resume id = " + currResume.getId() + "khong ton tai");
        this.resumeService.handleDeleteResume(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted Resume");
    }

    @GetMapping("/resumes/{id}")
    @ApiMessage("fetch Resume by id")
    public ResponseEntity<ResFetchResumeDTO> getResumeById(@PathVariable("id") long id) {
        Resume Resume = this.resumeService.fetchResumeById(id);
        return ResponseEntity.ok(this.resumeService.convertToResFetchResumeDTO(Resume));
    }

    @GetMapping("/resumes")
    @ApiMessage("fetch all Resume")
    public ResponseEntity<ResultPaginationDTO> getAllEntityResume(@Filter Specification<Resume> spec,
            Pageable pageable) {

        return ResponseEntity.ok(this.resumeService.fetchAllResume(spec, pageable));
    }

    @PostMapping("/resumes/by-user")
    @ApiMessage("fetch resume by user")
    public ResponseEntity<ResultPaginationDTO> getResumeByUser(Pageable pageable) {

        return ResponseEntity.ok(this.resumeService.fetchResumeByUser(pageable));
    }
}
