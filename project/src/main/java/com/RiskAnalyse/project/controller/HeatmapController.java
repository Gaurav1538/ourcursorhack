package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.response.HeatmapPoint;
import com.RiskAnalyse.project.service.HeatmapService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heatmap")
@CrossOrigin("*")
public class HeatmapController {

    private final HeatmapService service;

    public HeatmapController(HeatmapService service) {
        this.service = service;
    }

    @GetMapping
    public List<HeatmapPoint> getHeatmap(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2") double radius
    ) {
        return service.generateHeatmap(lat, lng, radius);
    }
}