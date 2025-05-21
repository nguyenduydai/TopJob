
package com.nguyenduydai.TopJob.controller;

import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.response.job.ResCreateJobDTO;
import com.nguyenduydai.TopJob.domain.response.job.ResUpdateJobDTO;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.JobService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;

import java.util.List;
import java.util.Map;

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
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/jobs")
    @ApiMessage("create a job")
    public ResponseEntity<ResCreateJobDTO> createJob(@Valid @RequestBody Job job) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.jobService.handleCreateJob(job));
    }

    @PutMapping("/jobs")
    @ApiMessage("update a job")
    public ResponseEntity<ResUpdateJobDTO> updateJob(@Valid @RequestBody Job postJob) throws IdInvalidException {
        Job currJob = this.jobService.fetchJobById(postJob.getId());
        if (currJob == null)
            throw new IdInvalidException("Job id = " + postJob.getId() + "khong ton tai");
        return ResponseEntity.status(HttpStatus.OK).body(this.jobService.handleUpdateJob(postJob, currJob));
    }

    @DeleteMapping("/jobs/{id}")
    @ApiMessage("delete Job")
    public ResponseEntity<ResString> deleteJob(@PathVariable("id") long id) throws IdInvalidException {
        Job currJob = this.jobService.fetchJobById(id);
        if (currJob == null)
            throw new IdInvalidException("Job id = " + currJob.getId() + "khong ton tai");
        this.jobService.handleDeleteJob(id);
        ResString res = new ResString("delete success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/jobs/{id}")
    @ApiMessage("fetch Job by id")
    public ResponseEntity<Job> getJobById(@PathVariable("id") long id) {
        Job Job = this.jobService.fetchJobById(id);
        return ResponseEntity.ok(Job);
    }

    @GetMapping("/jobs")
    @ApiMessage("fetch all Job")
    public ResponseEntity<ResultPaginationDTO> getAllJob(@Filter Specification<Job> spec, Pageable pageable) {

        return ResponseEntity.ok(this.jobService.fetchAllJob(spec, pageable));
    }

    @GetMapping("/jobsadmin")
    @ApiMessage("fetch all Job by hr")
    public ResponseEntity<ResultPaginationDTO> getAllJobAdmin(@Filter Specification<Job> spec, Pageable pageable) {

        return ResponseEntity.ok(this.jobService.fetchAllJobAdmin(spec, pageable));
    }

    @GetMapping("/jobsbycompany/{id}")
    @ApiMessage("fetch all Job bt comapny")
    public ResponseEntity<ResultPaginationDTO> getAllJobByCompany(@PathVariable("id") long id,
            @Filter Specification<Job> spec, Pageable pageable) {

        return ResponseEntity.ok(this.jobService.fetchAllJobByCompany(id, spec, pageable));
    }

    @GetMapping("/jobs/jobpermonth")
    public ResponseEntity<List<Map<String, Object>>> getJobApplicationsPerMonth() {
        // Lấy số lượng đơn ứng tuyển theo từng tháng
        List<Map<String, Object>> applicationsPerMonth = jobService.getJobPerMonth();
        return ResponseEntity.ok(applicationsPerMonth);
    }

    @GetMapping("/jobs/jobpermonthforhr")
    public ResponseEntity<List<Map<String, Object>>> getJobApplicationsPerMonthForHr() {
        List<Map<String, Object>> applicationsPerMonth = jobService.getJobPerMonthForHr();
        return ResponseEntity.ok(applicationsPerMonth);
    }

    @GetMapping("/jobs/jobhaveresumeforhr")
    public ResponseEntity<Map<String, Object>> getJobHaveResumeForHr() {
        Map<String, Object> applicationsPerMonth = jobService.getJobHaveResumeByCompany();
        return ResponseEntity.ok(applicationsPerMonth);
    }
}
