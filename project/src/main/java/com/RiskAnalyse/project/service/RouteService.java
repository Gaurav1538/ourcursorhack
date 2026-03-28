package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.request.RouteRequest;
import com.RiskAnalyse.project.dto.response.RouteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RiskService riskService;
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

        String eta;
        if (request.getStartLat() != null && request.getStartLng() != null
                && request.getEndLat() != null && request.getEndLng() != null) {
            double km = haversineKm(
                    request.getStartLat(), request.getStartLng(),
                    request.getEndLat(), request.getEndLng()
            );
            if (km > 200) {
                eta = "— (segment too long for a single ETA)";
            } else if (km > 100) {
                int minutes = estimateEtaMinutes(km, request.getMode());
                eta = minutes + "+ mins (approx)";
            } else {
                int minutes = estimateEtaMinutes(km, request.getMode());
                eta = minutes + " mins";
            }
        } else {
            eta = (8 + random.nextInt(40)) + " mins";
        }

        return RouteResponse.builder()
                .score(score)
                .riskLevel(getRiskLevel(score))
                .eta(eta)
                .traffic(random.nextBoolean() ? "Moderate" : "Light")
                .hotspots(generateHotspots(request.getEndLat(), request.getEndLng(), random))
                .build();
    }

    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static int estimateEtaMinutes(double km, String mode) {
        if (km <= 0) {
            return 5;
        }
        String m = mode == null ? "walking" : mode.toLowerCase();
        double kph;
        if (m.contains("drive") || m.contains("car")) {
            kph = 32;
        } else if (m.contains("transit") || m.contains("train")) {
            kph = 22;
        } else {
            kph = 4.5;
        }
        int mins = (int) Math.round(km / kph * 60.0);
        return Math.max(5, Math.min(240, mins));
    }

    private String getRiskLevel(int score) {
        if (score > 75) {
            return "Low";
        }
        if (score > 50) {
            return "Moderate";
        }
        return "High";
    }

    private List<RouteResponse.Hotspot> generateHotspots(Double endLat, Double endLng, Random random) {
        if (endLat != null && endLng != null) {
            List<RouteResponse.Hotspot> list = new ArrayList<>();
            for (int i = 0; i < 3; i++) {
                double dlat = (random.nextDouble() - 0.5) * 0.014;
                double dlng = (random.nextDouble() - 0.5) * 0.014;
                String risk = random.nextDouble() > 0.65 ? "High"
                        : (random.nextDouble() > 0.45 ? "Moderate" : "Low");
                list.add(RouteResponse.Hotspot.builder()
                        .lat(endLat + dlat)
                        .lng(endLng + dlng)
                        .risk(risk)
                        .build());
            }
            return list;
        }
        return List.of(
                RouteResponse.Hotspot.builder()
                        .lat(28.63)
                        .lng(77.21)
                        .risk("High")
                        .build(),
                RouteResponse.Hotspot.builder()
                        .lat(28.64)
                        .lng(77.22)
                        .risk("Moderate")
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
