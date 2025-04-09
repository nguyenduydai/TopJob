package com.nguyenduydai.TopJob.repository;

import org.springframework.stereotype.Repository;

import com.nguyenduydai.TopJob.domain.entity.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    boolean existsByName(String name);

    Role findByName(String name);

}
