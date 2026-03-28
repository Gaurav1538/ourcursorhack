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

        /* Sparser grid (~500m step, smaller span) — fewer circles on the map */
        double step = 0.005;
        double span = 0.01;

        for (double lat = centerLat - span; lat <= centerLat + span + 1e-9; lat += step) {
            for (double lng = centerLng - span; lng <= centerLng + span + 1e-9; lng += step) {

                double risk = riskService.calculateRisk(lat, lng);

                result.add(new HeatmapPoint(lat, lng, risk));
            }
        }

        return result;
    }
}