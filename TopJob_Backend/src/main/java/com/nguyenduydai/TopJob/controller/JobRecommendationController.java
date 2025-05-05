package com.nguyenduydai.TopJob.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduydai.TopJob.domain.entity.JobRecommendation;
import com.nguyenduydai.TopJob.domain.request.ReqUserRequirementDTO;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.JobRecommendationService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1")
public class JobRecommendationController {

    private final JobRecommendationService recommendationService;

    public JobRecommendationController(JobRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/jobrecommendation")
    @ApiMessage("generate job Recommendation for user")
    public ResponseEntity<ResString> generateRecommendation(
            @RequestBody ReqUserRequirementDTO survey) throws IdInvalidException {
        boolean haveJobRecommendation = this.recommendationService.generateRecommendationsForUser(survey);
        if (!haveJobRecommendation) {
            throw new IdInvalidException("Không tìm được công việc phù hợp với ứng viên này");
        }
        ResString res = new ResString("generate job Recommendation success");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/jobrecommendation")
    @ApiMessage("get Recommendations For User")
    public ResponseEntity<ResultPaginationDTO> getRecommendationsForUser(@Filter Specification<JobRecommendation> spec,
            Pageable pageable) {

        return ResponseEntity.ok(this.recommendationService.fetchRecommendationsForUser(spec, pageable));
    }
}