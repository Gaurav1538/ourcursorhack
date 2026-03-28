package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.response.NewsResponseDto;
import com.RiskAnalyse.project.service.ApifyService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class ApifyController {

    private final ApifyService apifyService;

    public ApifyController(ApifyService apifyService) {
        this.apifyService = apifyService;
    }

    @GetMapping("/crime")
    public List<NewsResponseDto> getCrimeNews(
            @RequestParam String city
    ) {
        return apifyService.getCrimeNews(city);
    }
}