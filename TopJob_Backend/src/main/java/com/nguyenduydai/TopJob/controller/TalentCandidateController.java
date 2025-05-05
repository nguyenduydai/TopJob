
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
import com.nguyenduydai.TopJob.domain.entity.TalentCandidate;
import com.nguyenduydai.TopJob.domain.request.ReqTalentCandidateDTO;
import com.nguyenduydai.TopJob.domain.request.ReqUserRequirementDTO;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.JobRecommendationService;
import com.nguyenduydai.TopJob.service.TalentCandidateService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1")
public class TalentCandidateController {

    private final TalentCandidateService talentService;

    public TalentCandidateController(TalentCandidateService talentService) {
        this.talentService = talentService;
    }

    @PostMapping("/talentcandidate/{id}")
    @ApiMessage("generate talentcandidate for job")
    public ResponseEntity<ResString> generateRecommendationForJob(
            @PathVariable("id") long id) throws IdInvalidException {

        boolean haveTalentcandidate = this.talentService.recommendCandidatesForJob(id);
        if (!haveTalentcandidate) {
            throw new IdInvalidException("Không tìm được ứng viên tiềm năng cho công việc này");
        }
        ResString res = new ResString("generate talent candidate for job success");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/talentcandidate")
    @ApiMessage("generate talentcandidate for company")
    public ResponseEntity<ResString> generateRecommendationForCompany(@RequestBody ReqTalentCandidateDTO reqDTO)
            throws IdInvalidException {

        boolean haveTalentcandidate = this.talentService.recommendCandidatesForCompany(reqDTO);
        if (!haveTalentcandidate) {
            throw new IdInvalidException("Không tìm được ứng viên tiềm năng cho công ty");
        }
        ResString res = new ResString("generate talent candidate for company success");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/talentcandidate/{id}")
    @ApiMessage("get talent candidate For Job")
    public ResponseEntity<ResultPaginationDTO> getRecommendationsForJob(@PathVariable("id") long id,
            @Filter Specification<TalentCandidate> spec,
            Pageable pageable) {

        return ResponseEntity.ok(this.talentService.fetchTalentCandidateForJob(id, spec, pageable));
    }

    @GetMapping("/talentcandidate")
    @ApiMessage("get talent candidate For Company")
    public ResponseEntity<ResultPaginationDTO> getRecommendationsForCompany(
            @Filter Specification<TalentCandidate> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.talentService.fetchTalentCandidateForCompany(spec, pageable));
    }
}