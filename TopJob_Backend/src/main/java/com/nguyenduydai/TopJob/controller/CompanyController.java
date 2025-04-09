package com.nguyenduydai.TopJob.controller;

import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.CompanyService;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/companies")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company) {

        return ResponseEntity.status(HttpStatus.CREATED).body(this.companyService.handleCreateCompany(company));
    }

    @PutMapping("/companies")
    public ResponseEntity<Company> updateNewCompany(@Valid @RequestBody Company postCompany) {
        postCompany = this.companyService.handleUpdateCompany(postCompany);
        return ResponseEntity.status(HttpStatus.OK).body(postCompany);
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable("id") long id) throws IdInvalidException {
        if (id > 1500)
            throw new IdInvalidException(" loi id lon hon 1500 ");
        this.companyService.handleDeleteCompany(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted Company");
    }

    @GetMapping("/companies/{id}")
    @ApiMessage("fetch company by id")
    public ResponseEntity<Company> getCompanyById(@PathVariable("id") long id) {
        Company company = this.companyService.fetchCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies")
    @ApiMessage("fetch all company")
    public ResponseEntity<ResultPaginationDTO> getAllCompany(@Filter Specification<Company> spec, Pageable pageable) {

        return ResponseEntity.ok(this.companyService.fetchAllCompany(spec, pageable));
    }

}
