package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.entity.Skill;
import com.nguyenduydai.TopJob.domain.entity.Subscriber;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.response.resume.ResCreateResumeDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResFetchResumeDTO;
import com.nguyenduydai.TopJob.domain.response.resume.ResUpdateResumeDTO;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.email.ResEmailJob;
import com.nguyenduydai.TopJob.domain.response.email.ResEmailResume;
import com.nguyenduydai.TopJob.repository.ResumeRepository;
import com.nguyenduydai.TopJob.util.SecurityUtil;

@Service
public class ResumeService {
    @Autowired
    private FilterBuilder fb;
    @Autowired
    private FilterParser filterParser;
    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;

    private final ResumeRepository resumeRepository;
    private final UserService userService;
    private final JobService jobService;
    private final EmailService emailService;

    public ResumeService(ResumeRepository resumeRepository, UserService userService, JobService jobService,
            EmailService emailService) {
        this.resumeRepository = resumeRepository;
        this.jobService = jobService;
        this.userService = userService;
        this.emailService = emailService;
    }

    public ResCreateResumeDTO handleCreateResume(Resume r) {
        User u = this.userService.fetchUserById(r.getUser().getId());
        Job j = this.jobService.fetchJobById(r.getJob().getId());
        r.setJob(j);
        r.setUser(u);
        r = this.resumeRepository.save(r);
        ResCreateResumeDTO res = new ResCreateResumeDTO();
        res.setId(r.getId());
        res.setCreatedAt(r.getCreatedAt());
        res.setCreatedBy(r.getCreatedBy());
        return res;
    }

    public ResUpdateResumeDTO handleUpdateResume(Resume r) {
        r = this.resumeRepository.save(r);
        ResUpdateResumeDTO res = new ResUpdateResumeDTO();
        res.setUpdatedAt(r.getUpdatedAt());
        res.setUpdatedBy(r.getUpdatedBy());
        return res;
    }

    public void handleDeleteResume(long id) {
        this.resumeRepository.deleteById(id);
    }

    public Resume fetchResumeById(long id) {
        Optional<Resume> resume = this.resumeRepository.findById(id);
        if (resume.isPresent())
            return resume.get();
        return null;
    }

    public List<Resume> fetchResumeByEmail(String email) {
        List<Resume> resume = this.resumeRepository.findByEmail(email);
        return resume;
    }

    public ResultPaginationDTO fetchAllResume(Specification<Resume> spec, Pageable pageable) {
        List<Long> arrJobIds = null;
        Specification<Resume> finalSpec = null;
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User currUser = this.userService.handleGetUserByUsername(email);
        if (currUser.getRole().getId() == 1) {
            finalSpec = spec;
        } else {
            if (currUser != null) {
                Company userCompany = currUser.getCompany();
                if (userCompany != null) {
                    List<Job> companyJobs = userCompany.getJobs();
                    if (companyJobs != null && companyJobs.size() > 0) {
                        arrJobIds = companyJobs.stream().map(i -> i.getId()).collect(Collectors.toList());
                    }
                }
            }
            Specification<Resume> jobInSpec = filterSpecificationConverter.convert(fb.field("job")
                    .in(fb.input(arrJobIds)).get());
            finalSpec = jobInSpec.and(spec);
        }
        Page<Resume> page = this.resumeRepository.findAll(finalSpec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);
        List<ResFetchResumeDTO> listResume = page.getContent().stream().map(item -> convertToResFetchResumeDTO(item))
                .collect(Collectors.toList());
        rs.setResult(listResume);
        return rs;
    }

    public ResultPaginationDTO fetchResumeByUser(Pageable pageable) {
        // query builder
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        FilterNode node = filterParser.parse("email='" + email + "'");
        FilterSpecification<Resume> spec = filterSpecificationConverter.convert(node);
        Page<Resume> page = this.resumeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);
        rs.setResult(
                page.getContent().stream().map(item -> convertToResFetchResumeDTO(item)).collect(Collectors.toList()));

        return rs;
    }

    public ResFetchResumeDTO convertToResFetchResumeDTO(Resume resume) {
        ResFetchResumeDTO res = new ResFetchResumeDTO();
        ResFetchResumeDTO.UserResume ur = new ResFetchResumeDTO.UserResume();
        ResFetchResumeDTO.JobResume jr = new ResFetchResumeDTO.JobResume();
        res.setId(resume.getId());
        res.setEmail(resume.getEmail());
        res.setUrl(resume.getUrl());
        res.setStatus(resume.getStatus());
        res.setCreatedAt(resume.getCreatedAt());
        res.setCreatedBy(resume.getCreatedBy());
        res.setUpdatedAt(resume.getUpdatedAt());
        res.setUpdatedBy(resume.getUpdatedBy());
        if (resume.getJob() != null) {
            jr.setId(resume.getJob().getId());
            jr.setName(resume.getJob().getName());
            res.setJob(jr);
            res.setCompanyName(resume.getJob().getCompany().getName());
        }
        if (resume.getUser() != null) {
            ur.setId(resume.getUser().getId());
            ur.setName(resume.getUser().getName());
            res.setUser(ur);
        }
        return res;
    }

    public boolean checkHaveUserAndJob(Resume resume) {
        if (resume.getUser() == null)
            return false;
        if (resume.getJob() == null)
            return false;
        if (this.userService.fetchUserById(resume.getUser().getId()) == null ||
                this.jobService.fetchJobById(resume.getJob().getId()) == null)
            return false;
        return true;
    }

    public boolean checkResumeExist(Resume resume) {
        if (this.resumeRepository.existsByUserIdAndJobId(resume.getUser().getId(), resume.getJob().getId()))
            return true;
        else
            return false;
    }

    public void sendEmailStatusResume(long id) {
        String emailHr = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        Resume resume = this.fetchResumeById(id);
        String emailUser = resume.getEmail();
        ResEmailResume res = new ResEmailResume();
        User user = this.userService.handleGetUserByUsername(emailUser);
        res.setNameUser(user.getName());
        res.setJobName(resume.getJob().getName());
        res.setCompanyName(resume.getJob().getCompany().getName());
        res.setEmailHr(emailHr);
        String status = resume.getStatus().toString();
        if (status.equals("PENDING"))
            res.setMessage(
                    "Hiện tại, đơn của bạn đang trong quá trình chờ đợi, xem xét và chúng tôi sẽ thông báo cho bạn kết quả sớm nhất có thể.");
        if (status.equals("REVIEWING"))
            res.setMessage(
                    "Đội ngũ tuyển dụng của chúng tôi đang đánh giá kỹ lưỡng và sẽ liên hệ với bạn trong thời gian sớm nhất.");
        if (status.equals("APPROVED"))
            res.setMessage(
                    "Chúng tôi rất vui mừng thông báo rằng đơn ứng tuyển của bạn đã được chấp nhận! Chúng tôi sẽ liên hệ với bạn để sắp xếp lịch phỏng vấn trong thời gian tới.");
        if (status.equals("REJECTED"))
            res.setMessage(
                    ". Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng bạn không được chọn cho vị trí này.");
        this.emailService.sendEmailResumeFromTemplateSync(emailUser,
                "Thông báo về trạng thái đơn ứng tuyển", "resume", res);
    }
}
