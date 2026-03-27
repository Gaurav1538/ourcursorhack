package com.RiskAnalyse.project.service;




import com.RiskAnalyse.project.dto.request.SafetyRequest;
import com.RiskAnalyse.project.dto.response.SafetyResponse;
import com.RiskAnalyse.project.model.Area;
import com.RiskAnalyse.project.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final AreaRepository areaRepository;
    private final ScoringService scoringService;

    public SafetyResponse analyze(SafetyRequest request) {

        Area area = areaRepository
                .findByCityAndAreaName(request.getCity(), request.getArea())
                .orElseThrow(() -> new RuntimeException("Area not found"));

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
                .crimes(Map.of(
                        "theft", area.getCrimeData().getTheft(),
                        "harassment", area.getCrimeData().getHarassment(),
                        "traffic", area.getCrimeData().getTraffic()
                ))
                .insights(generateInsights(score))
                .recommendations(generateRecommendations(score))
                .build();
    }

    private String getRiskLevel(int score) {
        if (score > 75) return "Low";
        if (score > 50) return "Moderate";
        return "High";
    }

    private List<String> generateInsights(int score) {
        if (score < 50) return List.of("High crime probability", "Low safety conditions");
        if (score < 75) return List.of("Moderate activity", "Stay cautious");
        return List.of("Safe conditions", "Normal activity");
    }

    private List<String> generateRecommendations(int score) {
        if (score < 50)
            return List.of("Avoid travel", "Use trusted transport");

        if (score < 75)
            return List.of("Stay alert", "Prefer crowded routes");

        return List.of("Safe to travel", "Basic precautions enough");
    }
}
