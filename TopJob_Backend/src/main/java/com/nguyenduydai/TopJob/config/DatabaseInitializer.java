package com.nguyenduydai.TopJob.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nguyenduydai.TopJob.domain.entity.Permission;
import com.nguyenduydai.TopJob.domain.entity.Role;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.repository.PermissionRepository;
import com.nguyenduydai.TopJob.repository.RoleRepository;
import com.nguyenduydai.TopJob.repository.UserRepository;
import com.nguyenduydai.TopJob.util.constant.GenderEnum;

import java.util.*;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(PermissionRepository permissionRepository, RoleRepository roleRepository,
            UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>>>> START INIT DATABASE >>>");
        long countPermissions = this.permissionRepository.count();
        long countRoles = this.roleRepository.count();
        long countUsers = this.userRepository.count();

        if (countPermissions == 0) {
            ArrayList<Permission> arr = new ArrayList<>();
            arr.add(new Permission("Create a company", "/api/v1/companies", "POST", "COMPANIES"));
            arr.add(new Permission("Update a company", "/api/v1/companies", "PUT", "COMPANIES"));
            arr.add(new Permission("Delete a company", "/api/v1/companies/{id}", "DELETE", "COMPANIES"));
            arr.add(new Permission("Get a company by id", "/api/v1/companies/{id}", "GET", "COMPANIES"));
            arr.add(new Permission("Get companies with pagination", "/api/v1/companies", "GET", "COMPANIES"));

            arr.add(new Permission("Create a job", "/api/v1/jobs", "POST", "JOBS"));
            arr.add(new Permission("Update a job", "/api/v1/jobs", "PUT", "JOBS"));
            arr.add(new Permission("Delete a job", "/api/v1/jobs/{id}", " DELETE",
                    "JOBS"));
            arr.add(new Permission("Get a job by id", "/api/v1/jobs/{id}", " GET",
                    "JOBS"));
            arr.add(new Permission("Get job with pagination", "/api/v1/jobs", "GET",
                    "JOBS"));
            arr.add(new Permission("Get job with pagination admin", "/api/v1/jobsadmin",
                    "GET", "JOBS"));

            arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
            arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
            arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
            arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", " GET", "PERMISSIONS"));
            arr.add(new Permission("Get permission with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));

            arr.add(new Permission("Create a resume", "/api/v1/resumes", "POST",
                    "RESUMES"));
            arr.add(new Permission("Update a resume", "/api/v1/resumes", "PUT",
                    "RESUMES"));
            arr.add(new Permission("Delete a resume", "/api/v1/resumes/{id}", " DELETE",
                    "RESUMES"));
            arr.add(new Permission("Get a resume by id", "/api/v1/resumes/{id}", " GET",
                    "RESUMES"));
            arr.add(new Permission("Get resume with pagination", "/api/v1/resumes",
                    "GET", "RESUMES"));
            arr.add(new Permission("Get resume with pagination",
                    "/api/v1/resumes/by-user", "POST", "RESUMES"));

            arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
            arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
            arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", " DELETE",
                    "ROLES"));
            arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", " GET",
                    "ROLES"));
            arr.add(new Permission("Get role with pagination", "/api/v1/roles", "GET",
                    "ROLES"));

            arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
            arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
            arr.add(new Permission("Delete a user", "/api/v1/users/{id}", " DELETE",
                    "USERS"));
            arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", " GET",
                    "USERS"));
            arr.add(new Permission("Get user with pagination", "/api/v1/users", "GET",
                    "USERS"));

            arr.add(new Permission("Create a subscriber", "/api/v1/subscribers", "POST",
                    "SUBSCRIBERS"));
            arr.add(new Permission("Update a subscriber", "/api/v1/subscribers", "PUT",
                    "SUBSCRIBERS"));
            arr.add(new Permission("Delete a subscriber", "/api/v1/subscribers/{id}", "DELETE", "SUBSCRIBERS"));
            arr.add(new Permission("Get a subscriber by id", "/api/v1/subscribers/{id}",
                    " GET", "SUBSCRIBERS"));
            arr.add(new Permission("Get subscriber with pagination",
                    "/api/v1/subscribers", "GET", "SUBSCRIBERS"));

            arr.add(new Permission("Create a blog", "/api/v1/blogs", "POST", "BLOGS"));
            arr.add(new Permission("Update a blog", "/api/v1/blogs", "PUT", "BLOGS"));
            arr.add(new Permission("Delete a blog", "/api/v1/blogs/{id}", " DELETE", "BLOGS"));
            arr.add(new Permission("Get a blog by id", "/api/v1/blogs/{id}", " GET", "BLOGS"));
            arr.add(new Permission("Get blog with pagination", "/api/v1/blogs", "GET", "BLOGS"));

            arr.add(new Permission("Download file", "/api/v1/files", "GET", "FILES"));
            arr.add(new Permission("Upload file", "/api/v1/files", "POST", "FILES"));
            this.permissionRepository.saveAll(arr);
        }
        if (countRoles == 0) {
            List<Permission> allPermissions = this.permissionRepository.findAll();
            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Admin thì full permissions");
            adminRole.setActive(true);
            adminRole.setPermissions(allPermissions);
            this.roleRepository.save(adminRole);
        }

        if (countUsers == 0) {
            User adminUser = new User();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setAddress("nam dinh");
            adminUser.setAge(22);
            adminUser.setGender(GenderEnum.MALE);
            adminUser.setName("I'm super admin");
            adminUser.setPassword(this.passwordEncoder.encode("123456"));
            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }
            this.userRepository.save(adminUser);
        }
        if (countPermissions > 0 && countRoles > 0 && countUsers > 0) {
            System.out.println(">>>> SKIP INIT DATABASE ");
        } else {
            System.out.println(">>>> END INIT DATABASE ");
        }

    }

}
