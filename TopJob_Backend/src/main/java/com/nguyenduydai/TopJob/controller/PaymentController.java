package com.nguyenduydai.TopJob.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduydai.TopJob.domain.response.payment.ResVNPay;
import com.nguyenduydai.TopJob.service.PaymentHistoryService;
import com.nguyenduydai.TopJob.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {

    private final PaymentService vnPayService;
    private final PaymentHistoryService paymentHistoryService;

    public PaymentController(PaymentService vnPayService, PaymentHistoryService paymentHistoryService) {
        this.paymentHistoryService = paymentHistoryService;
        this.vnPayService = vnPayService;
    }

    @GetMapping("/payments/create")
    public ResponseEntity<ResVNPay> createPayment(HttpServletRequest request,
            @RequestParam long amount,
            @RequestParam String orderInfo) throws UnsupportedEncodingException {
        String paymentUrl = vnPayService.createPaymentUrl(request, amount, orderInfo);
        ResVNPay res = new ResVNPay("ok", "success", paymentUrl);
        paymentHistoryService.handleCreatePaymentHistoryByVip(orderInfo);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/payments/return")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Xử lý khi VNPAY redirect về (kiểm tra chữ ký, trạng thái giao dịch)
        String status = request.getParameter("vnp_ResponseCode");
        String orderInfo = request.getParameter("vnp_OrderInfo");

        if (status.equals("00")) {
            response.sendRedirect("http://localhost:3000/admin?payment=success");
        } else
            response.sendRedirect("http://localhost:3000/admin?payment=failure");
    }
}