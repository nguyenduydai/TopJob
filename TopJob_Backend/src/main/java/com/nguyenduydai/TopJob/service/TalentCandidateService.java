package com.nguyenduydai.TopJob.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.entity.Skill;
import com.nguyenduydai.TopJob.domain.entity.Subscriber;
import com.nguyenduydai.TopJob.domain.entity.TalentCandidate;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqTalentCandidateDTO;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.email.ResEmailTalentCandidate;
import com.nguyenduydai.TopJob.repository.SkillRepository;
import com.nguyenduydai.TopJob.repository.TalentCandidateRepository;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.nguyenduydai.TopJob.util.constant.GenderEnum;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;

@Service
public class TalentCandidateService {
    private final JobService jobService;
    private final UserService userService;
    private final SubscriberService subscriberService;
    private final ResumeService resumeService;
    private final TalentCandidateRepository talentCandidateRepository;
    private final SkillRepository skillRepository;
    private final EmailService emailService;
    @Autowired
    private FilterBuilder fb;
    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;

    public TalentCandidateService(JobService jobService, UserService userService,
            SubscriberService subscriberService, ResumeService resumeService,
            TalentCandidateRepository talentCandidateRepository,
            SkillRepository skillRepository, EmailService emailService) {
        this.jobService = jobService;
        this.userService = userService;
        this.subscriberService = subscriberService;
        this.resumeService = resumeService;
        this.talentCandidateRepository = talentCandidateRepository;
        this.skillRepository = skillRepository;
        this.emailService = emailService;
    }

    @Transactional
    public boolean recommendCandidatesForJob(long id) {
        Job job = this.jobService.fetchJobById(id);
        boolean checkHaveJobRecommendations = false;
        List<User> users = this.userService.fetchAllUser();
        List<TalentCandidate> recommendations = new ArrayList<>();
        for (User user : users) {
            if (user.getRole() != null) {
                if (user.getRole().getId() == 1 || user.getRole().getId() == 2)
                    continue;
            }
            Subscriber sub = subscriberService.findByEmail(user.getEmail());
            double skillScore = 0;
            if (sub != null) {
                skillScore = calculateSkillMatchScore(job.getSkills(), sub.getSkills());
            }
            double ageScore = calculateAgeMatchScore(Integer.parseInt(job.getAgeRequirement().substring(0,
                    2)),
                    Integer.parseInt(job.getAgeRequirement().substring(3, 5)), user.getAge());
            double educationScore = calculateEducationMatchScore(job.getEducationRequirement(),
                    user.getEducation());
            double experienceScore = 0;
            if (user.getExperience() != null)
                experienceScore = calculateExperienceMatchScore(
                        Integer.parseInt(job.getExperienceRequirement().charAt(0) + ""),
                        Integer.parseInt(job.getExperienceRequirement().charAt(2) + ""),
                        Integer.parseInt(user.getExperience().charAt(0) + ""));
            double locationScore = calculateLocationMatchScore(job.getLocation(),
                    user.getAddress());
            double activityScore = calculateRecentActivityScore(user);

            double finalScore = 0.3 * skillScore + 0.2 * experienceScore + 0.15 * educationScore + 0.15 * locationScore
                    + 0.1 * activityScore + 0.1 * ageScore;
            if (finalScore > 0.6) {
                TalentCandidate recommendation = new TalentCandidate();
                recommendation.setUser(user);
                recommendation.setJob(job);
                recommendation.setCompatibilityScore(finalScore);
                recommendations.add(recommendation);
                checkHaveJobRecommendations = true;
            }
        }
        if (this.talentCandidateRepository.existsByJob(job)) {
            talentCandidateRepository.deleteByJob(job); // clear old recommendations
        }
        this.talentCandidateRepository.saveAll(recommendations);
        return checkHaveJobRecommendations;
    }

    @Transactional
    public boolean recommendCandidatesForCompany(ReqTalentCandidateDTO reqDTO) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User userHr = this.userService.handleGetUserByUsername(email);
        boolean checkHaveJobRecommendations = false;
        List<User> users = this.userService.fetchAllUser();
        List<TalentCandidate> recommendations = new ArrayList<>();
        for (User user : users) {
            if (user.getRole() != null) {
                if (user.getRole().getId() == 1 || user.getRole().getId() == 2)
                    continue;
            }
            Subscriber sub = subscriberService.findByEmail(user.getEmail());
            double skillScore = 0;
            if (sub != null) {
                skillScore = calculateSkillMatchScore(reqDTO.getSkills(), sub.getSkills());
            }
            double ageScore = calculateAgeMatchScore(Integer.parseInt(reqDTO.getAge().substring(0, 2)),
                    Integer.parseInt(reqDTO.getAge().substring(3, 5)), user.getAge());

            double experienceScore = 0;
            if (user.getExperience() != null)
                experienceScore = calculateExperienceMatchScore(
                        Integer.parseInt(reqDTO.getExperience().charAt(0) + ""),
                        Integer.parseInt(reqDTO.getExperience().charAt(2) + ""),
                        Integer.parseInt(user.getExperience().charAt(0) + ""));
            double locationScore = calculateLocationMatchScore(reqDTO.getAddress(), user.getAddress());
            double educationScore = calculateEducationMatchScore(reqDTO.getEducation(), user.getEducation());
            double activityScore = calculateRecentActivityScore(user);
            double genderScore = calculateGenderMatchScore(reqDTO.getGender(), user.getGender());
            if (!reqDTO.isActivity())
                activityScore = 0;
            double finalScore = reqDTO.getMultiplierSkills() * skillScore
                    + reqDTO.getMultiplierExperience() * experienceScore
                    + reqDTO.getMultiplierEducation() * educationScore + reqDTO.getMultiplierAge() * ageScore
                    + reqDTO.getMultiplierAddress() * locationScore + reqDTO.getMultiplierActivity() * activityScore
                    + reqDTO.getMultiplierGender() * genderScore;
            if (finalScore > 6) {
                TalentCandidate recommendation = new TalentCandidate();
                recommendation.setUser(user);
                recommendation.setCompany(userHr.getCompany());
                recommendation.setCompatibilityScore(finalScore);
                recommendation.setAge(reqDTO.getAge());
                recommendation.setMultiplierAge(reqDTO.getMultiplierAge());
                recommendation.setActivity(reqDTO.isActivity());
                recommendation.setMultiplierActivity(reqDTO.getMultiplierActivity());
                recommendation.setAddress(reqDTO.getAddress());
                recommendation.setMultiplierAddress(reqDTO.getMultiplierAddress());
                recommendation.setEducation(reqDTO.getEducation());
                recommendation.setMultiplierEducation(reqDTO.getMultiplierEducation());
                recommendation.setExperience(reqDTO.getExperience());
                recommendation.setMultiplierExperience(reqDTO.getMultiplierExperience());
                recommendation.setGender(reqDTO.getGender());
                recommendation.setMultiplierGender(reqDTO.getMultiplierGender());
                if (reqDTO.getSkills() != null) {
                    List<Long> p = reqDTO.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());
                    List<Skill> ls = this.skillRepository.findByIdIn(p);
                    recommendation.setSkills(ls);
                }
                recommendation.setMultiplierSkills(reqDTO.getMultiplierSkills());
                recommendations.add(recommendation);
                checkHaveJobRecommendations = true;
            }
        }
        for (TalentCandidate recommendationt : recommendations) {
            System.out.println(recommendationt.getUser().getName());
        }
        if (this.talentCandidateRepository.existsByCompany(userHr.getCompany())) {
            talentCandidateRepository.deleteByCompany(userHr.getCompany()); // clear old recommendations
        }
        this.talentCandidateRepository.saveAll(recommendations);
        return checkHaveJobRecommendations;
    }

    // Skill
    private double calculateSkillMatchScore(List<Skill> jobSkills, List<Skill> userSkills) {
        if (userSkills == null || jobSkills == null || jobSkills.isEmpty()) {
            return 0.0;
        }
        long matchCount = userSkills.stream()
                .filter(userSkill -> jobSkills.stream()
                        .anyMatch(jobSkill -> jobSkill.getId() == (userSkill.getId())))
                .count();
        return (double) matchCount / jobSkills.size(); // Tỉ lệ kỹ năng khớp
    }

    // Độ tuổi
    private double calculateAgeMatchScore(int minAge, int maxAge, int userAge) {
        if (userAge >= minAge && userAge <= maxAge)
            return 1.0;
        if (Math.abs(minAge - userAge) <= 3 || Math.abs(maxAge - userAge) <= 3)
            return 0.5;
        return 0;
    }

    // Trình độ học vấn
    private static final Map<String, Integer> educationLevelMap = new HashMap<>() {
        {
            put("HIGH_SCHOOL", 1);
            put("BACHELOR", 2);
            put("MASTER", 3);
            put("OTHER", 4);
        }
    };

    private double calculateEducationMatchScore(String jobRequiredEdu, String userEdu) {
        if (userEdu == null || jobRequiredEdu == null)
            return 0.0;
        Integer requiredLevel = educationLevelMap.get(jobRequiredEdu.toUpperCase());
        Integer userLevel = educationLevelMap.get(userEdu.toUpperCase());
        if (requiredLevel == null || userLevel == null)
            return 0.0;
        if (userLevel == requiredLevel)
            return 1.0;
        return userLevel > requiredLevel ? 0.5 : 0.0;
    }

    // Kinh nghiệm
    private double calculateExperienceMatchScore(int minExp, int maxExp, int userExp) {
        if (userExp >= minExp && userExp <= maxExp) {
            return 1.0;
        } else if (userExp > maxExp)
            return 0.5;
        return 0;
    }

    // Địa chỉ
    private double calculateLocationMatchScore(String jobLocation, String userLocation) {
        if (jobLocation == null || userLocation == null)
            return 0.0;
        return jobLocation.equalsIgnoreCase(userLocation) ? 1.0 : 0.0;
    }

    // Giới tính
    private double calculateGenderMatchScore(String genderreq, GenderEnum genderUser) {
        if (genderUser == null)
            return 0.0;
        return genderreq.equalsIgnoreCase(genderUser.toString()) ? 1.0 : 0.0;
    }

    // Mức độ hoạt động gần đây
    private double calculateRecentActivityScore(User user) {
        Instant lastUpdatedProfile = user.getUpdatedAt();
        List<Resume> listresume = this.resumeService.fetchResumeByEmail(user.getEmail());
        Instant lastUpdatedResume = null;
        if (listresume != null) {
            for (Resume resume : listresume) {
                if (resume != null)
                    lastUpdatedResume = resume.getCreatedAt();
            }
        }
        Subscriber sub = this.subscriberService.findByEmail(user.getEmail());
        Instant lastUpdatedSubscriber = null;
        if (sub != null)
            lastUpdatedSubscriber = sub.getUpdatedAt() != null ? sub.getUpdatedAt()
                    : sub.getCreatedAt();
        if (lastUpdatedProfile == null && lastUpdatedResume == null && lastUpdatedSubscriber == null)
            return 0.0;
        long daysSinceUpdate = 31, daysSinceUpdateResume = 31, daysSinceUpdateSubscriber = 31;
        if (lastUpdatedProfile != null) {
            daysSinceUpdate = Duration.between(lastUpdatedProfile, Instant.now()).toDays();
            if (daysSinceUpdate < 7)
                return 1.0;
        }
        if (lastUpdatedResume != null) {
            daysSinceUpdateResume = Duration.between(lastUpdatedResume, Instant.now()).toDays();
            if (daysSinceUpdate < 7)
                return 1.0;
        }
        if (lastUpdatedSubscriber != null) {
            daysSinceUpdateSubscriber = Duration.between(lastUpdatedSubscriber, Instant.now()).toDays();
            if (daysSinceUpdate < 7)
                return 1.0;
        }
        if (daysSinceUpdate < 30 || daysSinceUpdateResume < 30 || daysSinceUpdateSubscriber < 30)
            return 0.5;
        return 0.0;
    }

    public ResultPaginationDTO fetchTalentCandidateForJob(long id, Specification<TalentCandidate> spec,
            Pageable pageable) {
        // query builder
        Job cOptional = this.jobService.fetchJobById(id);
        Specification<TalentCandidate> finalSpec = null;
        if (cOptional == null) {
            finalSpec = spec;
        } else {
            Specification<TalentCandidate> jobInSpec = filterSpecificationConverter.convert(fb.field("job")
                    .in(fb.input(id)).get());
            finalSpec = jobInSpec.and(spec);
        }
        Page<TalentCandidate> page = this.talentCandidateRepository.findAll(finalSpec, pageable);
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

    public ResultPaginationDTO fetchTalentCandidateForCompany(Specification<TalentCandidate> spec,
            Pageable pageable) {
        // query builder\
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User userHr = this.userService.handleGetUserByUsername(email);
        Company company = userHr.getCompany();
        Specification<TalentCandidate> finalSpec = null;
        if (company == null) {
            finalSpec = spec;
        } else {
            Specification<TalentCandidate> jobInSpec = filterSpecificationConverter.convert(fb.field("company")
                    .in(fb.input(company.getId())).get());
            finalSpec = jobInSpec.and(spec);
        }
        Page<TalentCandidate> page = this.talentCandidateRepository.findAll(finalSpec, pageable);
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

    public boolean existsJob(long id) {
        Job job = this.jobService.fetchJobById(id);
        return this.talentCandidateRepository.existsByJob(job);
    }

    public void sendEmailForTalentCandidate(long id) {
        String emailHr = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User hr = this.userService.handleGetUserByUsername(emailHr);
        Optional<TalentCandidate> tcOptional = this.talentCandidateRepository.findById(id);
        TalentCandidate tc = (tcOptional.isPresent()) ? tcOptional.get() : null;
        String emailUser = tc.getUser().getEmail();
        ResEmailTalentCandidate resEmail = new ResEmailTalentCandidate();
        resEmail.setUserName(tc.getUser().getName());
        resEmail.setCompanyName(tc.getCompany().getName());
        resEmail.setHrName(hr.getName());
        resEmail.setHrEmail(emailHr);
        this.emailService.sendEmailTalentCandidateFromTemplateSync(emailUser,
                "Thư mời ứng tuyển", "candidate_invite", resEmail);
    }
}
