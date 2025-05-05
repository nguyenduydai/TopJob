package com.nguyenduydai.TopJob.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.TalentCandidate;
import com.nguyenduydai.TopJob.domain.entity.User;

@Repository
public interface TalentCandidateRepository
        extends JpaRepository<TalentCandidate, Long>, JpaSpecificationExecutor<TalentCandidate> {

    boolean existsByJob(Job job);

    void deleteByCompany(Company company);

    void deleteByJob(Job job);

    boolean existsByCompany(Company company);
}
