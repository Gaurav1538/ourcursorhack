package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.request.SafetyRequest;
import com.RiskAnalyse.project.dto.response.SafetyResponse;
import com.RiskAnalyse.project.model.Area;
import com.RiskAnalyse.project.model.embedded.CrimeData;
import com.RiskAnalyse.project.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final AreaRepository areaRepository;
    private final ScoringService scoringService;
    private final RiskService riskService;

    public SafetyResponse analyze(SafetyRequest request) {
        if (hasCoordinates(request)) {
            return analyzeFromCoordinates(request);
        }

        Optional<Area> exact = areaRepository.findByCityAndAreaName(
                request.getCity(), request.getArea());
        if (exact.isPresent()) {
            return analyzeFromArea(request, exact.get());
        }

        String cityOnly = extractPrimaryCityToken(request.getCity());
        if (cityOnly != null) {
            Optional<Area> byCity = areaRepository.findFirstByCityIgnoreCase(cityOnly);
            if (byCity.isPresent()) {
                return analyzeFromArea(request, byCity.get());
            }
        }

        return analyzeUnresolvedPlace(request);
    }

    private static boolean hasCoordinates(SafetyRequest request) {
        Double lat = request.getLat();
        Double lng = request.getLng();
        return lat != null && lng != null
                && !lat.isNaN() && !lng.isNaN()
                && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    }

    /**
     * "Delhi, India" → "Delhi"; already "Delhi" → "Delhi".
     */
    private static String extractPrimaryCityToken(String raw) {
        if (raw == null) {
            return null;
        }
        String t = raw.trim();
        if (t.isEmpty()) {
            return null;
        }
        int comma = t.indexOf(',');
        return comma > 0 ? t.substring(0, comma).trim() : t;
    }

    private SafetyResponse analyzeFromCoordinates(SafetyRequest request) {
        double risk = riskService.calculateRisk(request.getLat(), request.getLng());
        int safety = clampInt((int) Math.round(100.0 - risk), 0, 100);

        double r = risk / 100.0;
        Map<String, Double> breakdown = new LinkedHashMap<>();
        breakdown.put("Lighting & visibility", round1(clampD(92 - 35 * r, 38, 96)));
        breakdown.put("Crowding & transit feel", round1(clampD(88 - 30 * r, 42, 94)));
        breakdown.put("Incident signal (3 km)", round1(clampD(95 - 50 * r, 15, 98)));

        Map<String, Integer> crimes = Map.of(
                "theft", clampInt((int) Math.round(3 + 18 * r), 1, 80),
                "harassment", clampInt((int) Math.round(2 + 12 * r), 1, 60),
                "traffic", clampInt((int) Math.round(2 + 10 * r), 1, 50)
        );

        String label = placeLabel(request);
        return SafetyResponse.builder()
                .score(safety)
                .riskLevel(getRiskLevel(safety))
                .breakdown(breakdown)
                .crimes(crimes)
                .insights(coordinateInsights(safety, label))
                .recommendations(generateRecommendations(safety))
                .build();
    }

    private SafetyResponse analyzeFromArea(SafetyRequest request, Area area) {
        int score = scoringService.calculateScore(
                area.getAreaRisk(),
                request.getHour(),
                request.getProfile(),
                area.getEmergencyScore()
        );

        return SafetyResponse.builder()
                .score(score)
                .riskLevel(getRiskLevel(score))
                .breakdown(Map.of(
                        "areaRisk", area.getAreaRisk(),
                        "emergencyScore", area.getEmergencyScore()
                ))
                .crimes(crimesFromArea(area))
                .insights(generateInsights(score))
                .recommendations(generateRecommendations(score))
                .build();
    }

    /** No DB area and no coordinates — honest placeholder (avoids 500 + client static fallback). */
    private SafetyResponse analyzeUnresolvedPlace(SafetyRequest request) {
        String label = placeLabel(request);
        return SafetyResponse.builder()
                .score(58)
                .riskLevel("Moderate")
                .breakdown(Map.of(
                        "Data coverage", 45.0,
                        "Location match", 40.0
                ))
                .crimes(Map.of("theft", 2, "harassment", 1, "traffic", 1))
                .insights(List.of(
                        "We could not match \"" + label + "\" to a seeded area or coordinates.",
                        "Run a safety check from the planner with a geocoded place or GPS so the live index can update."
                ))
                .recommendations(List.of(
                        "Try the place name again, or open the map after choosing a location.",
                        "Enable location for “Here now” to use live incident weighting."
                ))
                .build();
    }

    private static String placeLabel(SafetyRequest request) {
        String c = request.getCity();
        if (c != null && !c.isBlank()) {
            return c.trim();
        }
        return "this place";
    }

    private List<String> coordinateInsights(int safetyScore, String placeLabel) {
        List<String> out = new ArrayList<>(2);
        String p = placeLabel != null && !placeLabel.isBlank() ? placeLabel : "this area";
        if (safetyScore >= 75) {
            out.add("For " + p + ", live weighted signals look relatively calm in the surrounding few kilometres.");
        } else if (safetyScore >= 50) {
            out.add("For " + p + ", signals are mixed — stay especially aware after dark and near busy corridors.");
        } else {
            out.add("For " + p + ", nearby incident weighting pushes the index up — plan routes and check the live map.");
        }
        out.add("The score rises or falls with incident distance, severity, and recency (about 3 km).");
        return out;
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

    private List<String> generateInsights(int score) {
        if (score < 50) {
            return List.of("High crime probability", "Low safety conditions");
        }
        if (score < 75) {
            return List.of("Moderate activity", "Stay cautious");
        }
        return List.of("Safe conditions", "Normal activity");
    }

    private List<String> generateRecommendations(int score) {
        if (score < 50) {
            return List.of("Avoid travel", "Use trusted transport");
        }
        if (score < 75) {
            return List.of("Stay alert", "Prefer crowded routes");
        }
        return List.of("Safe to travel", "Basic precautions enough");
    }

    private static int clampInt(int v, int lo, int hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    private static double clampD(double v, double lo, double hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private static Map<String, Integer> crimesFromArea(Area area) {
        CrimeData cd = area.getCrimeData();
        if (cd == null) {
            return Map.of("theft", 0, "harassment", 0, "traffic", 0);
        }
        return Map.of(
                "theft", cd.getTheft(),
                "harassment", cd.getHarassment(),
                "traffic", cd.getTraffic()
        );
    }
}
