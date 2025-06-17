package com.nguyenduydai.TopJob.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResFetchResumeDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResUserDTO;
import com.nguyenduydai.TopJob.service.CompanyService;
import com.nguyenduydai.TopJob.service.JobService;
import com.nguyenduydai.TopJob.service.ReportService;
import com.nguyenduydai.TopJob.service.ResumeService;
import com.nguyenduydai.TopJob.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class ReportController {

        private final ReportService reportService;
        private final JobService jobService;
        private final CompanyService companyService;
        private final ResumeService resumeService;
        private final UserService userService;

        public ReportController(ReportService reportService, JobService jobService, CompanyService companyService,
                        ResumeService resumeService, UserService userService) {
                this.reportService = reportService;
                this.jobService = jobService;
                this.companyService = companyService;
                this.resumeService = resumeService;
                this.userService = userService;

        }

        @GetMapping("/reports/jobs")
        public ResponseEntity<byte[]> generateJobReport() throws IOException {
                List<Job> list = this.jobService.fetchAllJorForReport();
                byte[] pdfBytes = reportService.generatePdfReport("job_report", list);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "job_report_" + LocalDateTime.now()
                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

        @GetMapping("/reports/jobsbycompany")
        public ResponseEntity<byte[]> generateJobReportForHr() throws IOException {
                Specification<Job> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
                Pageable pageable = PageRequest.of(0, 20);
                ResultPaginationDTO page = this.jobService.fetchAllJobAdmin(spec, pageable);
                Object list = page.getResult();
                byte[] pdfBytes = reportService.generatePdfReport("job_report", list);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "job_bycompany_report_"
                                                + LocalDateTime.now()
                                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                                                + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

        @GetMapping("/reports/companies")
        public ResponseEntity<byte[]> generateCompanyReport() throws IOException {
                List<Company> list = this.companyService.fetchAllCompanies();
                byte[] pdfBytes = reportService.generatePdfReport("company_report", list);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "company_report_"
                                                + LocalDateTime.now()
                                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                                                + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

        @GetMapping("/reports/resumes")
        public ResponseEntity<byte[]> generateResumeReport() throws IOException {
                List<Resume> list = this.resumeService.fetchAllResumes();
                List<ResFetchResumeDTO> listDTO = list.stream()
                                .map(item -> this.resumeService.convertToResFetchResumeDTO(item))
                                .collect(Collectors.toList());
                byte[] pdfBytes = reportService.generatePdfReport("resume_report", listDTO);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "resume_report_" + LocalDateTime.now()
                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                                                + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

        @GetMapping("/reports/resumesbycompany")
        public ResponseEntity<byte[]> generateResumeReportForHr() throws IOException {
                Specification<Resume> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
                Pageable pageable = PageRequest.of(0, 20);
                ResultPaginationDTO page = this.resumeService.fetchAllResume(spec, pageable);
                Object list = page.getResult();
                byte[] pdfBytes = reportService.generatePdfReport("resume_report", list);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "resume_bycompany_report_"
                                                + LocalDateTime.now()
                                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                                                + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

        @GetMapping("/reports/users")
        public ResponseEntity<byte[]> generateUserReport() throws IOException {
                List<User> list = this.userService.fetchAllUsers();
                List<ResUserDTO> listDTO = list.stream().map(item -> this.userService.convertToResUserDTO(item))
                                .collect(Collectors.toList());
                byte[] pdfBytes = reportService.generatePdfReport("user_report", listDTO);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                                "user_report_" + LocalDateTime.now()
                                                .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                                                + ".pdf");
                headers.setContentLength(pdfBytes.length);
                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }

}