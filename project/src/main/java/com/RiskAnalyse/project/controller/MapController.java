package com.RiskAnalyse.project.controller;


import com.RiskAnalyse.project.dto.response.HeatmapResponse;
import com.RiskAnalyse.project.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
@CrossOrigin
public class MapController {

    private final MapService mapService;

    @GetMapping("/heatmap")
    public List<HeatmapResponse> getHeatmap(@RequestParam String city) {
        return mapService.getHeatmap(city);
    }
}
