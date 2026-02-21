package com.newsportal.backend.controller;

import com.newsportal.backend.dto.LoginRequest;
import com.newsportal.backend.dto.RegisterRequest;
import com.newsportal.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req.getUsername(), req.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(409).build()); // 409 Conflict = username taken
    }
}
