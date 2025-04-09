
package com.nguyenduydai.TopJob.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Permission;
import com.nguyenduydai.TopJob.domain.entity.Role;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.repository.PermissionRepository;
import com.nguyenduydai.TopJob.repository.RoleRepository;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public Role handleCreateRole(Role r) {
        if (r.getPermissions() != null) {
            List<Long> pId = r.getPermissions().stream().map(x -> x.getId()).collect(Collectors.toList());
            List<Permission> p = this.permissionRepository.findByIdIn(pId);
            r.setPermissions(p);
        }
        return this.roleRepository.save(r);
    }

    public Role handleUpdateRole(Role r, Role roleDB) {
        if (r.getPermissions() != null) {
            List<Long> pId = r.getPermissions().stream().map(x -> x.getId()).collect(Collectors.toList());
            List<Permission> p = this.permissionRepository.findByIdIn(pId);
            r.setPermissions(p);
        }
        roleDB.setName(r.getName());
        roleDB.setActive(r.isActive());
        roleDB.setDescription(r.getDescription());
        roleDB.setPermissions(r.getPermissions());
        return this.roleRepository.save(roleDB);
    }

    public void handleDeleteRole(long id) {
        this.roleRepository.deleteById(id);
    }

    public Role fetchRoleById(long id) {
        Optional<Role> Role = this.roleRepository.findById(id);
        if (Role.isPresent())
            return Role.get();
        return null;
    }

    public ResultPaginationDTO fetchAllRole(Specification<Role> spec, Pageable pageable) {
        Page<Role> page = this.roleRepository.findAll(spec, pageable);
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

    public Optional<Role> findById(long id) {
        return this.roleRepository.findById(id);
    }

    public boolean isNameExist(String name) {
        return this.roleRepository.existsByName(name);
    }
}
