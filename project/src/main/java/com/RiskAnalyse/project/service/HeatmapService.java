package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.response.HeatmapPoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HeatmapService {

    private final RiskService riskService;

    public HeatmapService(RiskService riskService) {
        this.riskService = riskService;
    }

    public List<HeatmapPoint> generateHeatmap(
            double centerLat,
            double centerLng,
            double radiusKm
    ) {

        List<HeatmapPoint> result = new ArrayList<>();

        double step = 0.002; // ~200m grid

        for (double lat = centerLat - 0.01; lat <= centerLat + 0.01; lat += step) {
            for (double lng = centerLng - 0.01; lng <= centerLng + 0.01; lng += step) {

                double risk = riskService.calculateRisk(lat, lng);

                result.add(new HeatmapPoint(lat, lng, risk));
            }
        }

        return result;
    }
}