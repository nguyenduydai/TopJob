package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.entity.Skill;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.response.job.ResCreateJobDTO;
import com.nguyenduydai.TopJob.domain.response.job.ResUpdateJobDTO;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.CompanyRepository;
import com.nguyenduydai.TopJob.repository.JobRepository;
import com.nguyenduydai.TopJob.repository.SkillRepository;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;

import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired
    private FilterBuilder fb;
    @Autowired
    private FilterParser filterParser;
    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final CompanyRepository companyRepository;
    private final UserService userService;

    public JobService(JobRepository jobRepository, SkillRepository skillRepository,
            CompanyRepository companyRepository, UserService userService) {
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.userService = userService;
    }

    public ResCreateJobDTO handleCreateJob(Job j) {
        // check skills
        if (j.getSkills() != null) {
            List<Long> reqSkills = j.getSkills().stream()
                    .map(x -> x.getId()).collect(Collectors.toList());
            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            j.setSkills(dbSkills);
        }
        // check company
        if (j.getCompany() != null) {
            Optional<Company> cOptional = this.companyRepository.findById(j.getCompany().getId());
            if (cOptional.isPresent())
                j.setCompany(cOptional.get());
        }
        return this.convertToResCreateJobDTO(this.jobRepository.save(j));
    }

    public ResUpdateJobDTO handleUpdateJob(Job j, Job jobInDb) {
        // check skills
        if (j.getSkills() != null) {
            List<Long> reqSkills = j.getSkills().stream()
                    .map(x -> x.getId()).collect(Collectors.toList());
            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            jobInDb.setSkills(dbSkills);
        }
        // check company
        if (j.getCompany() != null) {
            Optional<Company> cOptional = this.companyRepository.findById(j.getCompany().getId());
            if (cOptional.isPresent())
                jobInDb.setCompany(cOptional.get());
        }
        jobInDb.setName(j.getName());
        jobInDb.setSalary(j.getSalary());
        jobInDb.setQuantity(j.getQuantity());
        jobInDb.setLocation(j.getLocation());
        jobInDb.setLevel(j.getLevel());
        jobInDb.setActive(j.isActive());
        jobInDb.setStartDate(j.getStartDate());
        jobInDb.setEndDate(j.getEndDate());

        jobInDb = this.jobRepository.save(jobInDb);
        return convertToResUpdateJobDTO(jobInDb);
    }

    public void handleDeleteJob(long id) {
        this.jobRepository.deleteById(id);
    }

    public Job fetchJobById(long id) {
        Optional<Job> job = this.jobRepository.findById(id);
        if (job.isPresent())
            return job.get();
        return null;
    }

    public ResultPaginationDTO fetchAllJob(Specification<Job> spec, Pageable pageable) {
        Page<Job> page = this.jobRepository.findAll(spec, pageable);
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

    public ResultPaginationDTO fetchAllJobAdmin(Specification<Job> spec, Pageable pageable) {
        // query builder
        Specification<Job> finalSpec = null;
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User currUser = this.userService.handleGetUserByUsername(email);
        Company userCompany = currUser.getCompany();
        if (userCompany == null) {
            finalSpec = spec;
        } else {
            Specification<Job> jobInSpec = filterSpecificationConverter.convert(fb.field("company")
                    .in(fb.input(userCompany.getId())).get());
            finalSpec = jobInSpec.and(spec);
        }
        Page<Job> page = this.jobRepository.findAll(finalSpec, pageable);
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

    public ResCreateJobDTO convertToResCreateJobDTO(Job job) {
        ResCreateJobDTO res = new ResCreateJobDTO();
        // ResCreateUserDTO.CompanyUser c = new ResCreateUserDTO.CompanyUser();
        res.setId(job.getId());
        res.setName(job.getName());
        res.setDescription(job.getDescription());
        res.setLevel(job.getLevel());
        res.setLocation(job.getLocation());
        res.setSalary(job.getSalary());
        res.setQuantity(job.getQuantity());
        res.setActive(job.isActive());
        res.setStartDate(job.getStartDate());
        res.setEndDate(job.getEndDate());
        res.setCreatedAt(job.getCreatedAt());
        res.setCreatedBy(job.getCreatedBy());
        if (job.getSkills() != null) {
            res.setSkills(job.getSkills().stream()
                    .map(x -> x.getName()).collect(Collectors.toList()));
        }
        return res;
    }

    public ResUpdateJobDTO convertToResUpdateJobDTO(Job job) {
        ResUpdateJobDTO res = new ResUpdateJobDTO();
        // ResCreateUserDTO.CompanyUser c = new ResCreateUserDTO.CompanyUser();
        res.setId(job.getId());
        res.setName(job.getName());
        res.setDescription(job.getDescription());
        res.setLevel(job.getLevel());
        res.setLocation(job.getLocation());
        res.setSalary(job.getSalary());
        res.setQuantity(job.getQuantity());
        res.setActive(job.isActive());
        res.setStartDate(job.getStartDate());
        res.setEndDate(job.getEndDate());
        res.setUpdatedAt(job.getCreatedAt());
        res.setUpdatedBy(job.getCreatedBy());
        if (job.getSkills() != null) {
            res.setSkills(job.getSkills().stream()
                    .map(x -> x.getName()).collect(Collectors.toList()));
        }
        return res;
    }
}
