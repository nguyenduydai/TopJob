package com.nguyenduydai.TopJob.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.Job;
import com.nguyenduydai.TopJob.domain.entity.Skill;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    boolean existsByName(String name);

    List<Skill> findByIdIn(List<Long> id);

    List<Job> findBySkillsIn(List<Skill> skills);
}
