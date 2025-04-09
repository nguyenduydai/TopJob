package com.nguyenduydai.TopJob.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nguyenduydai.TopJob.service.EmailService;
import com.nguyenduydai.TopJob.service.SubscriberService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;

@Controller
@RequestMapping("/api/v1")
public class EmailController {
    private final SubscriberService subscriberService;
    private final EmailService emailService;

    public EmailController(SubscriberService subscriberService, EmailService emailService) {
        this.subscriberService = subscriberService;
        this.emailService = emailService;
    }

    @GetMapping("/email")
    @ApiMessage("send simple email")
    // @Scheduled(cron = "*/30 * * * * *")
    // @Transactional
    public ResponseEntity<String> sendSimpleEmail() {
        // this.emailService.sendEmailSync("nguyenduydai5588@gmail.com", "test",
        // "<b>test send email</b>", false, true);
        this.subscriberService.sendSubscriberEmailJobs();
        return ResponseEntity.status(HttpStatus.OK).body("send email ok");
    }

}
