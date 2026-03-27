package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.request.RouteRequest;
import com.RiskAnalyse.project.dto.response.RouteResponse;
import com.RiskAnalyse.project.service.ScoringService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final ScoringService scoringService;

    public RouteResponse analyzeRoute(RouteRequest request) {

        Random random = new Random();

        double areaRisk = 0.3 + random.nextDouble() * 0.5;
        double emergencyScore = 0.8;

        int score = scoringService.calculateScore(
                areaRisk,
                request.getHour(),
                "solo",
                emergencyScore
        );

        return RouteResponse.builder()
                .score(score)
                .riskLevel(getRiskLevel(score))
                .eta("15 mins")
                .traffic("Moderate")
                .hotspots(generateHotspots())
                .build();
    }

    private String getRiskLevel(int score) {
        if (score > 75) return "Low";
        if (score > 50) return "Moderate";
        return "High";
    }

    private List<RouteResponse.Hotspot> generateHotspots() {
        return List.of(
                RouteResponse.Hotspot.builder()
                        .lat(28.63)
                        .lng(77.21)
                        .risk("high")
                        .build(),
                RouteResponse.Hotspot.builder()
                        .lat(28.64)
                        .lng(77.22)
                        .risk("moderate")
                        .build()
        );
    }
}