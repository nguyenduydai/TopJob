package com.nguyenduydai.TopJob.repository;

import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.Resume;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long>, JpaSpecificationExecutor<Resume> {

}
