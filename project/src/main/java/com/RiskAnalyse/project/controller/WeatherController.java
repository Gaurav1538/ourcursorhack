package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.response.WeatherResponseDto;
import com.RiskAnalyse.project.service.WeatherService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin("*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public List<WeatherResponseDto> getWeather(
            @RequestParam String city
    ) {
        return weatherService.getWeather(city);
    }
}