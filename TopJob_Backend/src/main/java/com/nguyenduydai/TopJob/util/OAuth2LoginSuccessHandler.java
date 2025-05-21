package com.nguyenduydai.TopJob.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqRegisterUserDTO;
import com.nguyenduydai.TopJob.domain.response.ResLoginDTO;
import com.nguyenduydai.TopJob.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    @Value("${jobhunter.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;
    @Autowired
    private UserService userService;

    @Autowired
    private SecurityUtil securityUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = authToken.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        User user = new User();
        boolean emailExist = this.userService.isEmailExist(email);
        if (!emailExist) {
            ReqRegisterUserDTO req = new ReqRegisterUserDTO();
            req.setEmail(email);
            req.setName(name);
            user = this.userService.handleCreateRegisterUser(req);
        } else {
            user = this.userService.handleGetUserByUsername(email);
        }
        ResLoginDTO dto = new ResLoginDTO();
        dto.setUser(new ResLoginDTO.UserLogin(user.getId(), user.getEmail(), user.getName(), user.getRole(),
                user.getCompany()));
        String accessToken = securityUtil.createAccessToken(email, dto);
        String refreshToken = securityUtil.createRefreshToken(email, dto);
        userService.updateUserToken(refreshToken, email);
        ResponseCookie responseCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true).secure(true).path("/").maxAge(refreshTokenExpiration).build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
        // Gửi thông tin về frontend (tùy chọn: chuyển tiếp redirect + gắn token)
        String redirectUrl = "http://localhost:3000/oauth2/redirect?access_token=" + accessToken;
        response.sendRedirect(redirectUrl);
    }
}