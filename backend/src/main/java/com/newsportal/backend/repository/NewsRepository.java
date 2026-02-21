package com.newsportal.backend.repository;

import com.newsportal.backend.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
}
