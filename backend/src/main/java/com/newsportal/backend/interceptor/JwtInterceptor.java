package com.newsportal.backend.interceptor;

import com.newsportal.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public JwtInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // Allow CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(401, "Missing or invalid Authorization header");
            return false;
        }

        try {
            Claims claims = jwtUtil.parse(header.substring(7));
            // Attach user info to request for controllers to use
            request.setAttribute("userId", Long.parseLong(claims.getSubject()));
            request.setAttribute("userName", claims.get("name", String.class));
        } catch (Exception e) {
            response.sendError(401, "Invalid or expired token");
            return false;
        }

        return true;
    }
}
