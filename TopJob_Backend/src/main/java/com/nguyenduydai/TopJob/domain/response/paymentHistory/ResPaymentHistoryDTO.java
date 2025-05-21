package com.nguyenduydai.TopJob.domain.response.paymentHistory;

import java.time.Instant;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPaymentHistoryDTO {
    private long id;
    private Instant paymentAt;
    private String userName;
    private String companyName;
    private Double price;
    private String status;
    private String typeVip;
}
