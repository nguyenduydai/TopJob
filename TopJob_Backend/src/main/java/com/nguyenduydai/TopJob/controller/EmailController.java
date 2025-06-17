package com.nguyenduydai.TopJob.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.service.EmailService;
import com.nguyenduydai.TopJob.service.ResumeService;
import com.nguyenduydai.TopJob.service.SubscriberService;
import com.nguyenduydai.TopJob.service.TalentCandidateService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;

@Controller
@RequestMapping("/api/v1")
public class EmailController {
    private final SubscriberService subscriberService;
    private final ResumeService resumeService;
    private final EmailService emailService;
    private final TalentCandidateService talentCandidateService;

    public EmailController(SubscriberService subscriberService, EmailService emailService,
            ResumeService resumeService, TalentCandidateService talentCandidateService) {
        this.resumeService = resumeService;
        this.subscriberService = subscriberService;
        this.emailService = emailService;
        this.talentCandidateService = talentCandidateService;
    }

    @GetMapping("/email/job")
    @ApiMessage("send simple email")
    @Scheduled(cron = "0 0 10 ? * MON")
    // ? bỏ qua ngày trong tháng
    // * tất cả mọi tháng
    @Transactional
    public ResponseEntity<ResString> sendSimpleEmail() {
        this.subscriberService.sendSubscriberEmailJobs();
        ResString res = new ResString("send email ok");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/email/resume/{id}")
    @ApiMessage("send simple email status resume")
    @Transactional
    public ResponseEntity<ResString> sendSimpleEmailResume(@PathVariable("id") long id) {
        this.resumeService.sendEmailStatusResume(id);
        ResString res = new ResString("send email status resume ok");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/email/talent/{id}")
    @ApiMessage("send simple email for talentCandidate")
    @Transactional
    public ResponseEntity<ResString> sendSimpleEmailTalentCandidate(@PathVariable("id") long id) {
        System.out.println(id);
        this.talentCandidateService.sendEmailForTalentCandidate(id);
        ResString res = new ResString("send  email for talentCandidate");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

}
