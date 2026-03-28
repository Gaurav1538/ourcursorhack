package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.service.RiskService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin("*")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
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
}