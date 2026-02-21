package com.newsportal.backend.service;

import com.newsportal.backend.dto.CommentRequest;
import com.newsportal.backend.dto.NewsRequest;
import com.newsportal.backend.entity.Comment;
import com.newsportal.backend.entity.News;
import com.newsportal.backend.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<News> getAll() {
        return newsRepository.findAll();
    }

    public Optional<News> getById(Long id) {
        return newsRepository.findById(id);
    }

    public News create(NewsRequest req, Long authorId) {
        News news = new News();
        news.setTitle(req.getTitle());
        news.setBody(req.getBody());
        news.setAuthorId(authorId);
        return newsRepository.save(news);
    }

    // Returns empty Optional if not found, throws RuntimeException("Forbidden") if
    // wrong author
    public Optional<News> update(Long id, NewsRequest req, Long requesterId) {
        return newsRepository.findById(id).map(news -> {
            if (!news.getAuthorId().equals(requesterId)) {
                throw new RuntimeException("Forbidden");
            }
            news.setTitle(req.getTitle());
            news.setBody(req.getBody());
            return newsRepository.save(news);
        });
    }

    // Returns false if not found, throws RuntimeException("Forbidden") if wrong
    // author
    public boolean delete(Long id, Long requesterId) {
        Optional<News> opt = newsRepository.findById(id);
        if (opt.isEmpty())
            return false;
        News news = opt.get();
        if (!news.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Forbidden");
        }
        newsRepository.delete(news);
        return true;
    }

    public Optional<News> addComment(Long newsId, CommentRequest req, Long userId) {
        return newsRepository.findById(newsId).map(news -> {
            Comment comment = new Comment();
            comment.setText(req.getText());
            comment.setUserId(userId);
            comment.setTimestamp(Instant.now().toString());
            comment.setNews(news);
            news.getComments().add(comment);
            return newsRepository.save(news);
        });
    }
}
