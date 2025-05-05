package com.nguyenduydai.TopJob.repository;

import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.Resume;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.*;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long>, JpaSpecificationExecutor<Resume> {
    boolean existsByUserIdAndJobId(long userId, long jobId);

    List<Resume> findByEmail(String email);

    Optional<Resume> findById(long id);
}
