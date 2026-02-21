package com.newsportal.backend.controller;

import com.newsportal.backend.dto.CommentRequest;
import com.newsportal.backend.dto.NewsRequest;
import com.newsportal.backend.entity.News;
import com.newsportal.backend.service.NewsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public List<News> getAll() {
        return newsService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getOne(@PathVariable Long id) {
        return newsService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<News> create(@Valid @RequestBody NewsRequest req, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ResponseEntity.status(201).body(newsService.create(req, userId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody NewsRequest req,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        try {
            return newsService.update(id, req, userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body("Forbidden: you are not the author");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        try {
            if (newsService.delete(id, userId)) {
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<News> addComment(@PathVariable Long id, @Valid @RequestBody CommentRequest req,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return newsService.addComment(id, req, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
