package com.nguyenduydai.TopJob.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduydai.TopJob.domain.entity.PaymentHistory;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.paymentHistory.ResPaymentHistoryDTO;
import com.nguyenduydai.TopJob.service.PaymentHistoryService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1")
public class PaymentHistoryController {
    private final PaymentHistoryService paymentHistoryService;

    public PaymentHistoryController(PaymentHistoryService paymentHistoryService) {
        this.paymentHistoryService = paymentHistoryService;
    }

    @DeleteMapping("/payment-history/{id}")
    @ApiMessage("delete payment history by id")
    public ResponseEntity<ResString> deletePermission(@PathVariable("id") long id) throws IdInvalidException {
        PaymentHistory currPaymentHistory = this.paymentHistoryService.fetchPaymentHistoryById(id);
        if (currPaymentHistory == null)
            throw new IdInvalidException("Permission id = " + currPaymentHistory.getId() + "khong ton tai");
        this.paymentHistoryService.handleDeletePaymentHistory(id);
        ResString res = new ResString("delete success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/payment-history/{id}")
    @ApiMessage("fetch payment history by id")
    public ResponseEntity<ResPaymentHistoryDTO> getPaymentHistoryById(@PathVariable("id") long id) {
        ResPaymentHistoryDTO currPaymentHistory = this.paymentHistoryService.fetchPaymentHistoryByIdToDTO(id);
        return ResponseEntity.ok(currPaymentHistory);
    }

    @GetMapping("/payment-history")
    @ApiMessage("fetch all Permission")
    public ResponseEntity<ResultPaginationDTO> getAllEntityPermission(@Filter Specification<PaymentHistory> spec,
            Pageable pageable) {

        return ResponseEntity.ok(this.paymentHistoryService.fetchAllPaymentHistory(spec, pageable));
    }

}
