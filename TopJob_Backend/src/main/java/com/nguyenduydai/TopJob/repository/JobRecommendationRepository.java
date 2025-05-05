
package com.nguyenduydai.TopJob.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.JobRecommendation;
import com.nguyenduydai.TopJob.domain.entity.User;

@Repository
public interface JobRecommendationRepository
        extends JpaRepository<JobRecommendation, Long>, JpaSpecificationExecutor<JobRecommendation> {
    void deleteByUser(User user);

    boolean existsByUser(User user);
}
