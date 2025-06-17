package com.nguyenduydai.TopJob.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.nguyenduydai.TopJob.util.OAuth2LoginSuccessHandler;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    @Value("${jobhunter.jwt.base64-secret}")
    private String jwtKey;

    public static final MacAlgorithm JW_ALGORITHM = MacAlgorithm.HS512;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) throws Exception {
        // String[] whiteList = { "/", "/api/v1/auth/**", "/api/v1/email/**",
        // "/storage/**", "/api/v1/reports/**",
        // "/api/v1/jobrecommendation", "/v3/api-docs/**", "/swagger-ui/**",
        // "/swagger-ui.html",
        // "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", "/api/v1/payment/**",
        // "/api/v1/files/**",
        // };
        // http
        // .csrf(c -> c.disable())
        // .cors(Customizer.withDefaults())
        // .authorizeHttpRequests(
        // authz -> authz.requestMatchers(whiteList).permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/companies/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/jobsbycompany/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/blogs/**").permitAll()
        // .requestMatchers(HttpMethod.PUT, "/api/v1/blogs/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/skills/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/users/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/roles/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/api/v1/comments/**").permitAll()
        // .anyRequest().authenticated())
        // .oauth2ResourceServer((oauth) -> oauth.jwt(Customizer.withDefaults())
        // .authenticationEntryPoint(customAuthenticationEntryPoint))
        // .oauth2Login(oauth2 -> oauth2
        // .successHandler(oAuth2LoginSuccessHandler))
        // .formLogin(f -> f.disable())
        // .sessionManagement(session ->
        // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        String[] whiteList = { "/", "/api/v1/auth/**", "/storage/**", "/api/v1/files/**", "/api/v1/email/**",
                "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/api/v1/payments/**",
                "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
        };
        http
                .csrf(c -> c.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(
                        authz -> authz.requestMatchers(whiteList).permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/companies/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/skills/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/blogs/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/v1/blogs/**").permitAll()// like
                                .requestMatchers(HttpMethod.GET, "/api/v1/comments/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/users/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/roles/**").permitAll()
                                .anyRequest().authenticated())
                .oauth2ResourceServer((oauth) -> oauth.jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(customAuthenticationEntryPoint))
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler))
                .formLogin(f -> f.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JW_ALGORITHM.getName());
    }

    // ghi đè bean JwtEncoder hàm mã hóa token
    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(this.getSecretKey()));
    }

    // ghi đè bean JwtEncoder hàm giải mã token
    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(this.getSecretKey())
                .macAlgorithm(SecurityUtil.JW_ALGORITHM).build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                System.out.println(">>>JWT error : " + e.getMessage());
                throw e;
            }
        };
    }

    // hàm convert token để lấy ra quyền hạn của user
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permission");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;

    }

    // mã hóa mật khẩu người dùng
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
