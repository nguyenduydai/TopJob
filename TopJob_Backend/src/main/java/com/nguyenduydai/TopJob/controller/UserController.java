package com.nguyenduydai.TopJob.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.domain.request.ReqChangePasswordDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResCreateUserDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResUpdateUserDTO;
import com.nguyenduydai.TopJob.domain.response.user.ResUserDTO;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.UserService;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    @ApiMessage("create a new user")
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User postManUser)
            throws IdInvalidException {
        boolean emailExist = this.userService.isEmailExist(postManUser.getEmail());
        if (emailExist) {
            throw new IdInvalidException("Email " + postManUser.getEmail() + "da ton tai");
        }
        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
        postManUser.setPassword(hashPassword);
        User user = this.userService.handleCreateUser(postManUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(user));
    }

    @PutMapping("/users")
    @ApiMessage("update a user")
    public ResponseEntity<ResUpdateUserDTO> updateNewUser(@RequestBody User postManUser) throws IdInvalidException {
        User u = this.userService.handleUpdateUser(postManUser);
        if (u == null)
            throw new IdInvalidException("User voi id " + u.getId() + " khong ton tai");
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResUpdateUserDTO(u));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("delete a user")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
        if (id > 1500)
            throw new IdInvalidException(" loi id lon hon 1500 ");
        User currUser = this.userService.fetchUserById(id);
        if (currUser == null) {
            throw new IdInvalidException("User voi id " + id + " khong ton tai");
        }
        this.userService.handleDeleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted User");
    }

    @GetMapping("/users/{id}")
    @ApiMessage("fetch user by id")
    public ResponseEntity<ResUserDTO> getUserById(@PathVariable("id") long id) throws IdInvalidException {
        User user = this.userService.fetchUserById(id);
        if (user == null) {
            throw new IdInvalidException("User voi id " + id + " khong ton tai");
        }
        return ResponseEntity.ok(this.userService.convertToResUserDTO(user));
    }

    @GetMapping("/users")
    @ApiMessage("fetch all user")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@Filter Specification<User> spec, Pageable pageable) {
        return ResponseEntity.ok(this.userService.fetchAllUser(spec, pageable));
    }

    @PutMapping("/users/changepassword")
    @ApiMessage("change Password a user")
    public ResponseEntity<ResString> changePasswordUser(@RequestBody ReqChangePasswordDTO reqChangePasswordDTO)
            throws IdInvalidException {
        if (reqChangePasswordDTO.getOldPassword().equals(
                reqChangePasswordDTO.getNewPassword()))
            throw new IdInvalidException("Mật khẩu mới phải khác mật khẩu cũ");
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        boolean successChangePassword = this.userService.handleChangePasswordUser(email,
                reqChangePasswordDTO.getOldPassword(),
                reqChangePasswordDTO.getNewPassword());
        if (!successChangePassword) {
            throw new IdInvalidException("Sai mật khẩu cũ!");
        }
        ResString res = new ResString("change password success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
