package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.request.RouteRequest;
import com.RiskAnalyse.project.dto.response.RouteResponse;
import com.RiskAnalyse.project.service.ScoringService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
//@RequiredArgsConstructor
public class RouteService {

    private final RiskService riskService;
    private final ScoringService scoringService;
    public RouteService(RiskService riskService, ScoringService scoringService) {
        this.scoringService = scoringService;
        this.riskService = riskService;
    }

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
    public List<Object> getSafeRoute(
            double startLat, double startLng,
            double endLat, double endLng
    ) {

        List<Object> route = new ArrayList<>();

        int steps = 10;

        for (int i = 0; i <= steps; i++) {

            double lat = startLat + (endLat - startLat) * i / steps;
            double lng = startLng + (endLng - startLng) * i / steps;

            double risk = riskService.calculateRisk(lat, lng);

            route.add(new Object() {
                public final double latitude = lat;
                public final double longitude = lng;
                public final double riskScore = risk;
            });
        }

        return route;
    }
}