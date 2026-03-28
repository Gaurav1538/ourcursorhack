package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trends")
public class TrendController {

    private final IncidentRepository repository;

    public TrendController(IncidentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Object getTrends() {

        long total = repository.count();

        return new Object() {
            public final long totalIncidents = total;
            public final String trend = total > 50 ? "INCREASING" : "STABLE";
        };
    }
}