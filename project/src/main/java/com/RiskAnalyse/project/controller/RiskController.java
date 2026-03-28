package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.service.AiService;
import com.RiskAnalyse.project.service.RiskService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin("*")
public class RiskController {

    private final RiskService riskService;
    private final AiService aiService;

    public RiskController(RiskService riskService,AiService aiService) {
        this.riskService = riskService;
        this.aiService = aiService;
    }

    @GetMapping
    public Object getRisk(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        double score = riskService.calculateRisk(lat, lng);

        String level;
        if (score < 30) level = "LOW";
        else if (score < 70) level = "MEDIUM";
        else level = "HIGH";

        return new Object() {
            public final double riskScore = score;
            public final String riskLevel = level;
        };
    }
    @GetMapping("/detailed")
    public Object getDetailedRisk(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        double score = riskService.calculateRisk(lat, lng);

        String explanation = aiService.explainRisk(lat, lng, score);
        String tips = aiService.suggestSafety(lat, lng, score);

        return new Object() {
            public final double riskScore = score;
            public final String explanationText = explanation;
            public final String safetyTips = tips;
        };
    }

}