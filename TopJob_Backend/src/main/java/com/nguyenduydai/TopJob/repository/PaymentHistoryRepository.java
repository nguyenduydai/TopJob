package com.nguyenduydai.TopJob.repository;

import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.PaymentHistory;
import com.nguyenduydai.TopJob.domain.entity.Permission;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface PaymentHistoryRepository
        extends JpaRepository<PaymentHistory, Long>, JpaSpecificationExecutor<PaymentHistory> {

}
