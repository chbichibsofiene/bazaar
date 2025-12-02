package com.bazar.controller;

import com.bazar.domain.User_Role;
import com.bazar.model.User;
import com.bazar.repository.UserRepository;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserService userService;

    private void verifyAdminRole(String jwt) throws Exception {
        User currentUser = userService.findUserByJwtToken(jwt);
        if (currentUser.getRole() != User_Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage;

        if (search != null && !search.isEmpty()) {
            userPage = userRepository.findByEmailContainingOrFullNameContaining(search, search, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("users", userPage.getContent());
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User userUpdate,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userUpdate.getFullName() != null) {
            user.setFullName(userUpdate.getFullName());
        }
        if (userUpdate.getEmail() != null) {
            user.setEmail(userUpdate.getEmail());
        }
        if (userUpdate.getMobile() != null) {
            user.setMobile(userUpdate.getMobile());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> roleUpdate,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        String roleStr = roleUpdate.get("role");
        User_Role newRole = User_Role.valueOf(roleStr);
        user.setRole(newRole);

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}
