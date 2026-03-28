package com.RiskAnalyse.project.dto.response;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RouteResponse {

    private int score;
    private String riskLevel;
    private String eta;
    private String traffic;

    private List<Hotspot> hotspots;

    @Data
    @Builder
    public static class Hotspot {
        private double lat;
        private double lng;
        private String risk;
    }
}
