package com.RiskAnalyse.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class SafetyResponse {

    private int score;
    private String riskLevel;

    private Map<String, Double> breakdown;

    private Map<String, Integer> crimes;

    private List<String> insights;
    private List<String> recommendations;
}
