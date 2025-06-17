package com.nguyenduydai.TopJob.service;

import java.time.Instant;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.PaymentHistory;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.paymentHistory.ResPaymentHistoryDTO;
import com.nguyenduydai.TopJob.repository.PaymentHistoryRepository;
import com.nguyenduydai.TopJob.util.SecurityUtil;

@Service
public class PaymentHistoryService {
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final UserService userService;
    private final CompanyService companyService;

    public PaymentHistoryService(PaymentHistoryRepository paymentHistoryRepository, UserService userService,
            CompanyService companyService) {
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.userService = userService;
        this.companyService = companyService;
    }

    public PaymentHistory handleCreatePaymentHistory(PaymentHistory c) {
        return this.paymentHistoryRepository.save(c);
    }

    public PaymentHistory handleUpdatePaymentHistory(PaymentHistory paymentHistory) {
        PaymentHistory paymentHistoryInDb = this.fetchPaymentHistoryById(paymentHistory.getId());
        if (paymentHistory.getUser() != null)
            paymentHistoryInDb.setUser(paymentHistory.getUser());
        if (paymentHistory.getPrice() != null)
            paymentHistoryInDb.setPrice(paymentHistory.getPrice());
        if (paymentHistory.getPaymentAt() != null)
            paymentHistoryInDb.setPaymentAt(paymentHistory.getPaymentAt());
        if (paymentHistory.getStatus() != null)
            paymentHistoryInDb.setStatus(paymentHistory.getStatus());
        if (paymentHistory.getTypeVip() != null)
            paymentHistoryInDb.setTypeVip(paymentHistory.getTypeVip());

        return this.paymentHistoryRepository.save(paymentHistoryInDb);
    }

    public void handleDeletePaymentHistory(long id) {
        Optional<PaymentHistory> s = this.paymentHistoryRepository.findById(id);
        PaymentHistory currpaymentHistory = s.get();
        this.paymentHistoryRepository.delete(currpaymentHistory);
    }

    public PaymentHistory fetchPaymentHistoryById(long id) {
        Optional<PaymentHistory> paymentHistory = this.paymentHistoryRepository.findById(id);
        if (paymentHistory.isPresent())
            return paymentHistory.get();
        return null;
    }

    public ResPaymentHistoryDTO fetchPaymentHistoryByIdToDTO(long id) {
        Optional<PaymentHistory> paymentHistory = this.paymentHistoryRepository.findById(id);
        if (paymentHistory.isPresent())
            return this.convertToDTO(paymentHistory.get());
        return null;
    }

    public ResultPaginationDTO fetchAllPaymentHistory(Specification<PaymentHistory> spec, Pageable pageable) {
        Page<PaymentHistory> page = this.paymentHistoryRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);
        rs.setResult(page.getContent().stream().map(item -> convertToDTO(item)).collect(Collectors.toList()));
        return rs;
    }

    public ResPaymentHistoryDTO convertToDTO(PaymentHistory h) {
        ResPaymentHistoryDTO dto = new ResPaymentHistoryDTO();
        dto.setId(h.getId());
        dto.setTypeVip(h.getTypeVip());
        dto.setPrice(h.getPrice());
        dto.setStatus(h.getStatus());
        dto.setPaymentAt(h.getPaymentAt());
        User user = this.userService.fetchUserById(h.getUser().getId());
        dto.setUserName(user.getName());
        dto.setCompanyName(user.getCompany().getName());
        return dto;
    }

    public PaymentHistory handleCreatePaymentHistoryByVip(String vip) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User currUser = this.userService.handleGetUserByUsername(email);
        Company c = currUser.getCompany();
        PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setUser(currUser);
        paymentHistory.setStatus("payment success");
        paymentHistory.setPaymentAt(Instant.now());
        if (vip.equals("vip1")) {
            paymentHistory.setPrice((double) 2999000);
            paymentHistory.setTypeVip("VIP 1");
            c.setStart(1);
        }
        if (vip.toString().equals("vip2")) {
            paymentHistory.setPrice((double) 8999000);
            paymentHistory.setTypeVip("VIP 2");
            c.setStart(2);
        }
        this.userService.handleUpdateUserByVip(currUser, vip);
        this.companyService.handleUpdateCompanyByVip(c);
        return this.paymentHistoryRepository.save(paymentHistory);
    }

}
