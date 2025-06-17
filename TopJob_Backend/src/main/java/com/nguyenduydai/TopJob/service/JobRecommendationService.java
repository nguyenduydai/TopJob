package com.nguyenduydai.TopJob.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.JobRecommendation;
import com.nguyenduydai.TopJob.domain.entity.Skill;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqUserRequirementDTO;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.JobRecommendationRepository;
import com.nguyenduydai.TopJob.repository.JobRepository;
import com.nguyenduydai.TopJob.repository.UserRepository;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;

@Service
public class JobRecommendationService {
    @Autowired
    private FilterBuilder fb;
    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;
    private final JobRepository jobRepository;
    private final JobRecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public JobRecommendationService(JobRepository jobRepository, JobRecommendationRepository recommendationRepository,
            UserService userService,
            UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public boolean generateRecommendationsForUser(ReqUserRequirementDTO survey) {
        boolean checkHaveJobRecommendations = false;
        String emailUser = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userService.handleGetUserByUsername(emailUser);
        List<Job> jobs = jobRepository.findAll();
        List<JobRecommendation> recommendations = new ArrayList<>();

        for (Job job : jobs) {
            double score = calculateTotalScore(job, survey);
            if (score > 0.6) {
                JobRecommendation recommendation = new JobRecommendation();
                recommendation.setUser(user);
                recommendation.setJob(job);
                recommendation.setMatchScore(score);
                recommendations.add(recommendation);
                checkHaveJobRecommendations = true;
            }
        }
        if (this.recommendationRepository.existsByUser(user)) {
            recommendationRepository.deleteByUser(user); // clear old recommendations
        }
        recommendationRepository.saveAll(recommendations);
        return checkHaveJobRecommendations;
    }

    private double calculateTotalScore(Job job, ReqUserRequirementDTO survey) {
        double skillScore = calculateSkillMatchScore(job.getSkills(), survey.getSkills());
        double locationScore = calculateLocationMatchScore(job.getLocation(), survey.getLocation());
        double salaryScore = calculateSalaryMatchScore(job.getSalary(), survey.getSalary());
        double levelScore = calculateLevelMatchScore(job.getLevel().toString(), survey.getLevel());
        double environmentScore = calculateEnvironmentMatchScore(job.getJobEnvironment(), survey.getJobEnvironment());
        double quantityScore = calculateQuantityMatchScore(job.getQuantity(), survey.isQuality());

        double educationScore = 0;
        double experienceScore = 0;
        double ageScore = 0;
        if (survey.getEducationRequirement() == null || survey.getEducationRequirement() == "")
            experienceScore = 0;
        else {
            educationScore = calculateEducationMatchScore(job.getEducationRequirement(),
                    survey.getEducationRequirement());
        }
        if (survey.getExperienceRequirement() == null || survey.getExperienceRequirement() == "")
            experienceScore = 0;
        else {
            experienceScore = calculateExperienceMatchScore(
                    Integer.parseInt(job.getExperienceRequirement().charAt(0) + ""),
                    Integer.parseInt(job.getExperienceRequirement().charAt(2) + ""),
                    Integer.parseInt(survey.getExperienceRequirement().charAt(0) + ""));
        }
        if (survey.getAgeRequirement() != 0)
            ageScore = calculateAgeMatchScore(Integer.parseInt(job.getAgeRequirement().substring(0, 2)),
                    Integer.parseInt(job.getAgeRequirement().substring(3, 5)), survey.getAgeRequirement());
        // Trọng số tùy chỉnh
        return 0.25 * skillScore +
                0.15 * salaryScore +
                0.15 * levelScore +
                0.1 * locationScore +
                0.1 * experienceScore +
                0.1 * environmentScore +
                0.05 * educationScore +
                0.05 * ageScore +
                0.05 * quantityScore;
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

    // Địa chỉ
    private double calculateLocationMatchScore(String jobLocation, String userLocation) {
        return userLocation != null && userLocation.equalsIgnoreCase(jobLocation) ? 1.0 : 0.0;
    }

    // Lương
    private double calculateSalaryMatchScore(double jobSalary, double userExpectedSalary) {
        double diff = Math.abs(userExpectedSalary - jobSalary);
        double percentDiff = diff / userExpectedSalary;
        if (percentDiff <= 0.1 || userExpectedSalary <= jobSalary)
            return 1.0;
        else if (percentDiff <= 0.3)
            return 0.75;
        else if (percentDiff <= 0.5)
            return 0.5;
        else
            return 0.0;
    }

    // Level
    private double calculateLevelMatchScore(String jobLevel, String userLevel) {
        return userLevel != null && userLevel.equalsIgnoreCase(jobLevel) ? 1.0 : 0.0;
    }

    // Môi trường làm việc
    private double calculateEnvironmentMatchScore(String jobEnvironment, String userEnvPref) {
        return userEnvPref != null && userEnvPref.equalsIgnoreCase(jobEnvironment) ? 1.0 : 0.0;
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
        return userLevel >= requiredLevel ? 1.0 : 0.0;
    }

    // Kinh nghiệm
    private double calculateExperienceMatchScore(int minExp, int maxExp, int userExp) {
        return userExp >= minExp ? 1.0 : (double) userExp / ((minExp + maxExp) / 2);
    }

    // Độ tuổi
    private double calculateAgeMatchScore(int minAge, int maxAge, int userAge) {
        if (userAge >= minAge && userAge <= maxAge)
            return 1.0;
        if (Math.abs(minAge - userAge) <= 3 || Math.abs(maxAge - userAge) <= 3)
            return 0.5;
        return 0;
    }

    // Số lượng tuyển
    private double calculateQuantityMatchScore(int jobQuantity, boolean quality) {
        if (quality) {
            if (jobQuantity >= 10)
                return 1.0;
            else if (jobQuantity >= 5)
                return 0.5;
            else
                return 0.2;
        } else
            return 1;
    }

    public ResultPaginationDTO fetchRecommendationsForUser(Specification<JobRecommendation> spec, Pageable pageable) {
        // query builder
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User user = this.userService.handleGetUserByUsername(email);
        Specification<JobRecommendation> finalSpec = null;
        if (user == null) {
            finalSpec = spec;
        } else {
            Specification<JobRecommendation> jobInSpec = filterSpecificationConverter.convert(fb.field("user")
                    .in(fb.input(user.getId())).get());
            finalSpec = jobInSpec.and(spec);
        }
        Page<JobRecommendation> page = this.recommendationRepository.findAll(finalSpec, pageable);
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

}
