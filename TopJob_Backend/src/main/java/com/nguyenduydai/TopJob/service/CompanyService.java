package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.CompanyRepository;
import com.nguyenduydai.TopJob.repository.UserRepository;

@Service
public class CompanyService {
    private final UserRepository userRepository;

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Company handleCreateCompany(Company c) {
        return this.companyRepository.save(c);
    }

    public Company handleCreateCompanyUserResgister(String name, String address) {
        Company c = new Company();
        c.setName(name);
        c.setAddress(address);
        return this.companyRepository.save(c);
    }

    public Company handleUpdateCompany(Company company) {
        Company c = this.fetchCompanyById(company.getId());
        if (c != null) {
            c.setDescription(company.getDescription());
            c.setName(company.getName());
            c.setAddress(company.getAddress());
            c.setLogo(company.getLogo());
            c = this.companyRepository.save(c);
        }
        return c;
    }

    public void handleDeleteCompany(long id) {
        Optional<Company> c = this.companyRepository.findById(id);
        if (c.isPresent()) {
            Company com = c.get();
            List<User> users = this.userRepository.findByCompany(com);
            this.userRepository.deleteAll(users);
        }
        this.companyRepository.deleteById(id);
    }

    public Company fetchCompanyById(long id) {
        Optional<Company> company = this.companyRepository.findById(id);
        if (company.isPresent())
            return company.get();
        return null;
    }

    public Company fetchCompanyByName(String name) {
        Optional<Company> company = this.companyRepository.findByName(name);
        if (company != null)
            return company.get();
        return null;
    }

    public ResultPaginationDTO fetchAllCompany(Specification<Company> spec, Pageable pageable) {
        Page<Company> page = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);
        rs.setResult(page.getContent());

        return rs;
    }

    public Optional<Company> findById(long id) {
        return this.companyRepository.findById(id);
    }

    public boolean existsByName(String name) {
        return this.companyRepository.existsByName(name);
    }
}
