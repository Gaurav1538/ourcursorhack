package com.RiskAnalyse.project.service;


import com.RiskAnalyse.project.dto.response.HeatmapResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapService {

    public List<HeatmapResponse> getHeatmap(String city) {

        return List.of(
                HeatmapResponse.builder()
                        .lat(28.61)
                        .lng(77.20)
                        .intensity(0.8)
                        .build(),

                HeatmapResponse.builder()
                        .lat(28.65)
                        .lng(77.22)
                        .intensity(0.4)
                        .build()
        );
    }
}
