package com.nguyenduydai.TopJob.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.nguyenduydai.TopJob.domain.entity.Permission;
import com.nguyenduydai.TopJob.domain.entity.Role;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.service.UserService;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.nguyenduydai.TopJob.util.error.PermissionException;

public class PermissionInterceptor implements HandlerInterceptor {
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response, Object handler)
            throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path=" + path);
        System.out.println(">>> httpMethod=" + httpMethod);
        System.out.println(">>> requestURI= " + requestURI);

        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        if (email != null && !email.isEmpty()) {
            User currUser = this.userService.handleGetUserByUsername(email);
            if (currUser != null) {
                Role role = currUser.getRole();
                if (role != null) {
                    List<Permission> permissions = role.getPermissions();
                    boolean isAllow = permissions.stream().anyMatch(item -> item.getApiPath().equals(path)
                            && item.getMethod().equals(httpMethod));
                    if (isAllow == false) {
                        throw new PermissionException("Ban khong co quyen truy cap endpoint nay");
                    }
                } else {
                    throw new PermissionException("Ban khong co quyen truy cap endpoint nay");
                }
            }
        }
        return true;
    }
}
