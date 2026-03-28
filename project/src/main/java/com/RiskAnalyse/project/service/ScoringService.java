package com.RiskAnalyse.project.service;


import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    public int calculateScore(double areaRisk, int hour, String profile, double emergencyScore) {

        double timeRisk;

        if (hour >= 6 && hour < 18) timeRisk = 0.2;
        else if (hour < 22) timeRisk = 0.5;
        else timeRisk = 0.8;

        double profileRisk = switch (profile.toLowerCase()) {
            case "female" -> 0.8;
            case "solo" -> 0.6;
            case "student" -> 0.5;
            case "family" -> 0.3;
            default -> 0.5;
        };

        double score =
                100 -
                        (0.35 * areaRisk +
                                0.25 * timeRisk +
                                0.20 * profileRisk +
                                0.10 * 0.5 +   // mock signals
                                0.10 * (1 - emergencyScore)) * 100;

        return (int) Math.round(score);
    }
}
