package com.nguyenduydai.TopJob.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Company;
import com.nguyenduydai.TopJob.domain.entity.Resume;
import com.nguyenduydai.TopJob.domain.entity.Role;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqRegisterUserDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResUserDTO;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResCreateUserDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResUpdateUserDTO;
import com.nguyenduydai.TopJob.repository.UserRepository;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CompanyService companyService, RoleService roleService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyService = companyService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    public User handleCreateUser(User user) {
        if (user.getCompany() != null) {
            Optional<Company> c = this.companyService.findById(user.getCompany().getId());
            user.setCompany(c.isPresent() ? c.get() : null);
        }
        if (user.getRole() != null) {
            Role r = this.roleService.fetchRoleById(user.getRole().getId());
            user.setRole(r != null ? r : null);
        }
        return this.userRepository.save(user);
    }

    public User handleCreateRegisterUser(ReqRegisterUserDTO postuser) {
        User user = new User();
        user.setEmail(postuser.getEmail());
        user.setName(postuser.getName());
        user.setAge(postuser.getAge());
        user.setAddress(postuser.getAddress());
        user.setGender(postuser.getGender());
        user.setPassword(postuser.getPassword());
        user.setPhone(postuser.getPhone());
        if (postuser.getCompanyName() != null) {
            if (this.companyService.existsByName(postuser.getCompanyName())) {
                Company c = this.companyService.fetchCompanyByName(postuser.getCompanyName());
                c.setBusinessLicense(postuser.getBusinessLicense());
                this.companyService.handleUpdateCompany(c);
                user.setCompany(c);
            } else {
                Company c = this.companyService.handleCreateCompanyUserResgister(postuser.getCompanyName(),
                        postuser.getAddress(), postuser.getBusinessLicense());
                user.setCompany(c);
            }
        } else {
            user.setCompany(null);
        }
        if (postuser.getTypeVip() != null) {
            user.setTypeVip(postuser.getTypeVip());
        }

        user.setActive(postuser.isActive());
        Role r = this.roleService.fetchRoleById(postuser.getRoleId());
        user.setRole(r != null ? r : null);
        return this.userRepository.save(user);
    }

    public User handleUpdateUser(User user) {
        User u = this.fetchUserById(user.getId());
        if (u != null) {
            u.setEmail(user.getEmail());
            u.setName(user.getName());
            u.setAge(user.getAge());
            u.setAddress(user.getAddress());
            u.setGender(user.getGender());
            u.setCreatedAt(user.getCreatedAt());
            u.setUpdatedAt(user.getUpdatedAt());
            u.setPassword(user.getPassword());
            u.setExperience(user.getExperience());
            u.setEducation(user.getEducation());
            u.setPhone(user.getPhone());
            if (user.getCompany() != null) {
                Optional<Company> c = this.companyService.findById(user.getCompany().getId());
                u.setCompany(c.isPresent() ? c.get() : null);
            }
            if (user.getRole() != null) {
                Role r = this.roleService.fetchRoleById(user.getRole().getId());
                u.setRole(r != null ? r : null);
            }
            if (user.getCv() != null || user.getCv().equals(""))
                u.setCv(user.getCv());
            u.setActive(user.isActive());
            u = this.userRepository.save(u);
        }
        return u;
    }

    public void handleDeleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    public User fetchUserById(long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isPresent())
            return user.get();
        return null;
    }

    public List<User> fetchAllUser() {
        return this.userRepository.findAll();
    }

    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> page = this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());
        rs.setMeta(mt);

        List<ResUserDTO> list = page.getContent().stream().map(item -> this.convertToResUserDTO(item))
                .collect(Collectors.toList());
        rs.setResult(list);

        return rs;
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResCreateUserDTO convertToResCreateUserDTO(User user) {
        ResCreateUserDTO res = new ResCreateUserDTO();
        ResCreateUserDTO.CompanyUser c = new ResCreateUserDTO.CompanyUser();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setAddress(user.getAddress());
        res.setGender(user.getGender());
        res.setCreatedAt(user.getCreatedAt());
        if (user.getCompany() != null) {
            c.setId(user.getCompany().getId());
            c.setName(user.getCompany().getName());
            res.setCompanyUser(c);
        }
        return res;
    }

    public ResUserDTO convertToResUserDTO(User user) {
        ResUserDTO res = new ResUserDTO();
        ResUserDTO.CompanyUser c = new ResUserDTO.CompanyUser();
        ResUserDTO.RoleUser r = new ResUserDTO.RoleUser();
        if (user.getCompany() != null) {
            c.setId(user.getCompany().getId());
            c.setName(user.getCompany().getName());
            res.setCompany(c);
        }
        if (user.getRole() != null) {
            r.setId(user.getRole().getId());
            r.setName(user.getRole().getName());
            res.setRole(r);
            res.setRoleName(user.getRole().getName());
        }
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setAddress(user.getAddress());
        res.setGender(user.getGender());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setPassword(user.getPassword());
        res.setExperience(user.getExperience());
        res.setEducation(user.getEducation());
        res.setPhone(user.getPhone());
        res.setCv(user.getCv());
        res.setTypeVip(user.getTypeVip());
        res.setVipExpiry(user.getVipExpiry());
        res.setActive(user.isActive());
        return res;
    }

    public ResUpdateUserDTO convertToResUpdateUserDTO(User user) {
        ResUpdateUserDTO res = new ResUpdateUserDTO();
        ResUpdateUserDTO.CompanyUser c = new ResUpdateUserDTO.CompanyUser();
        if (user.getCompany() != null) {
            c.setId(user.getCompany().getId());
            c.setName(user.getCompany().getName());
            res.setCompanyUser(c);
        }

        res.setId(user.getId());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setAddress(user.getAddress());
        res.setGender(user.getGender());
        res.setUpdateAt(user.getUpdatedAt());
        return res;
    }

    public void updateUserToken(String token, String email) {
        User u = this.handleGetUserByUsername(email);
        if (u != null) {
            u.setRefreshToken(token);
            this.userRepository.save(u);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    public boolean handleChangePasswordUser(String email, String oldPassword, String newPassword) {
        User user = this.handleGetUserByUsername(email);
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            String hash = passwordEncoder.encode(newPassword);
            user.setPassword(hash);
            user = this.userRepository.save(user);
            return true;
        } else
            return false;
    }

    public User handleUpdateUserByVip(User user, String vip) {
        User u = this.fetchUserById(user.getId());
        if (u != null) {
            if (vip.equals("vip1")) {
                Instant currentInstant = Instant.now();
                ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.systemDefault());
                ZonedDateTime futureDateTime = zonedDateTime.plusMonths(12);
                Instant futureInstant = futureDateTime.toInstant();
                u.setTypeVip("VIP 1");
                u.setVipExpiry(futureInstant);
            }
            if (vip.equals("vip2")) {
                Instant currentInstant = Instant.now();
                ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.systemDefault());
                ZonedDateTime futureDateTime = zonedDateTime.plusMonths(24);
                Instant futureInstant = futureDateTime.toInstant();
                u.setTypeVip("VIP 2");
                u.setVipExpiry(futureInstant);
            }
            u = this.userRepository.save(u);
        }
        return u;
    }

    public List<User> fetchAllUsers() {
        return this.userRepository.findAll(); // Lấy tất cả công ty
    }

}
