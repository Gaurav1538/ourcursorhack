package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.service.AiService;
import com.RiskAnalyse.project.service.RiskService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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

        String level = riskLevelLabel(score);

        final double s = score;
        final String l = level;
        return new Object() {
            public final double score = s;
            public final double riskScore = s;
            public final String riskLevel = l;
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
        String level = riskLevelLabel(score);
        List<String> factors = riskFactors(score);

        final double s = score;
        final String l = level;
        final List<String> f = factors;
        return new Object() {
            public final double score = s;
            public final double riskScore = s;
            public final String riskLevel = l;
            public final List<String> factors = f;
            public final String explanationText = explanation;
            public final String safetyTips = tips;
        };
    }

    private static String riskLevelLabel(double score) {
        if (score < 30) {
            return "Low";
        }
        if (score < 70) {
            return "Moderate";
        }
        return "High";
    }

    private static List<String> riskFactors(double score) {
        List<String> out = new ArrayList<>(2);
        if (score < 30) {
            out.add("Few weighted incidents within the search radius");
        } else if (score < 70) {
            out.add("Some incident signals in the surrounding area");
        } else {
            out.add("Higher weighted incident density nearby");
        }
        out.add("Distance, severity, and recency are combined in the score");
        return out;
    }

}