package com.nguyenduydai.TopJob.domain.entity;

import java.time.Instant;

import com.nguyenduydai.TopJob.util.constant.VipEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payment_histories")
@Getter
@Setter
public class PaymentHistory extends BaseEntity {

    private Double price;

    private String status;

    @Enumerated(EnumType.STRING)
    private VipEnum typeVip;

    private Instant paymentAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}