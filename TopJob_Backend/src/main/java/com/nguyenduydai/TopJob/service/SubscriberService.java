package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Skill;
import com.nguyenduydai.TopJob.domain.entity.Subscriber;
import com.nguyenduydai.TopJob.domain.response.ResEmailJob;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.JobRepository;
import com.nguyenduydai.TopJob.repository.SkillRepository;
import com.nguyenduydai.TopJob.repository.SubscriberRepository;

@Service
public class SubscriberService {
    private final SubscriberRepository subscriberRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final EmailService emailService;

    public SubscriberService(SubscriberRepository subscriberRepository, SkillRepository skillRepository,
            JobRepository jobRepository, EmailService emailService) {
        this.subscriberRepository = subscriberRepository;
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.emailService = emailService;
    }

    public Subscriber handleCreateSubscriber(Subscriber r) {
        if (r.getSkills() != null) {
            List<Long> p = r.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());
            List<Skill> ls = this.skillRepository.findByIdIn(p);
            r.setSkills(ls);
        }
        return this.subscriberRepository.save(r);
    }

    public Subscriber handleUpdateSubscriber(Subscriber subscriber) {
        Subscriber s = fetchSubscriberById(subscriber.getId());
        if (subscriber.getSkills() != null) {
            List<Long> idSkills = subscriber.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());
            List<Skill> listSkill = this.skillRepository.findByIdIn(idSkills);
            s.setSkills(listSkill);
        }
        return this.subscriberRepository.save(s);
    }

    public void handleDeleteSubscriber(long id) {

        this.subscriberRepository.deleteById(id);
    }

    public Subscriber fetchSubscriberById(long id) {
        Optional<Subscriber> Subscriber = this.subscriberRepository.findById(id);
        if (Subscriber.isPresent())
            return Subscriber.get();
        return null;
    }

    public ResultPaginationDTO fetchAllSubscriber(Specification<Subscriber> spec, Pageable pageable) {
        Page<Subscriber> page = this.subscriberRepository.findAll(spec, pageable);
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

    public boolean isEmailExist(String name) {
        return this.subscriberRepository.existsByEmail(name);
    }

    public void sendSubscriberEmailJobs() {
        List<Subscriber> listSubs = this.subscriberRepository.findAll();
        if (listSubs != null && listSubs.size() > 0) {
            for (Subscriber sub : listSubs) {
                // với mỗi người dùng đăng ký lấy ra list skill họ đã đăng ký
                List<Skill> listSkills = sub.getSkills();
                if (listSkills != null && listSkills.size() > 0) {
                    // lấy ra list job với mỗi skill họ đã đăng ký
                    List<Job> listJobs = this.jobRepository.findBySkillsIn(listSkills);
                    if (listJobs != null && listJobs.size() > 0) {
                        // convert mỗi job đó sang dto
                        List<ResEmailJob> arr = listJobs.stream().map(job -> this.convertJobToSendEmailJob(job))
                                .collect(Collectors.toList());
                        this.emailService.sendEmailFromTemplateSync(sub.getEmail(),
                                "Cơ hội làm việc chờ đón bạn, khám phá ngay",
                                "job", sub.getName(), arr);
                    }
                }
            }
        }
    }

    public ResEmailJob convertJobToSendEmailJob(Job job) {
        ResEmailJob res = new ResEmailJob();
        res.setName(job.getName());
        res.setSalary(job.getSalary());
        res.setCompany(new ResEmailJob.CompanyEmail(job.getCompany().getName()));
        List<Skill> skills = job.getSkills();
        List<ResEmailJob.SkillEmail> s = skills.stream().map(skill -> new ResEmailJob.SkillEmail(skill.getName()))
                .collect(Collectors.toList());
        res.setSkills(s);
        return res;
    }

    public Subscriber findByEmail(String email) {
        return this.subscriberRepository.findByEmail(email);
    }
}
