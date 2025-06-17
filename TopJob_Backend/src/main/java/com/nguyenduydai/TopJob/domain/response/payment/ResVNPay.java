package com.nguyenduydai.TopJob.domain.response.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResVNPay {
    private String code;
    private String message;
    private String paymentUrl;

}
