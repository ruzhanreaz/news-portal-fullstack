package com.newsportal.backend.service;

import com.newsportal.backend.dto.LoginResponse;
import com.newsportal.backend.dto.RegisterRequest;
import com.newsportal.backend.dto.UserDto;
import com.newsportal.backend.entity.User;
import com.newsportal.backend.repository.UserRepository;
import com.newsportal.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public Optional<LoginResponse> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPasswordHash() != null
                        && passwordEncoder.matches(password, user.getPasswordHash()))
                .map(user -> {
                    String token = jwtUtil.generate(user.getId(), user.getName());
                    return new LoginResponse(token, new UserDto(user.getId(), user.getName()));
                });
    }

    public Optional<LoginResponse> register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return Optional.empty();
        }
        User user = new User();
        user.setUsername(req.getUsername());
        user.setName(req.getName());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generate(user.getId(), user.getName());
        return Optional.of(new LoginResponse(token, new UserDto(user.getId(), user.getName())));
    }
}
