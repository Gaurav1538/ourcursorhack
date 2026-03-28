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

    /** Straight-line distance in km when start/end coordinates are provided */
    private Double distanceKm;
    /** Estimated travel time in minutes (mode-aware) */
    private Integer durationMinutes;
    /** Echo of requested travel mode */
    private String mode;
    /** Short human-readable summary of the geometry estimate */
    private String routeSummary;
    /** Sample points along the straight-line segment (for map preview / future routing) */
    private List<Waypoint> waypoints;

    private List<Hotspot> hotspots;

    @Data
    @Builder
    public static class Hotspot {
        private double lat;
        private double lng;
        private String risk;
    }

    @Data
    @Builder
    public static class Waypoint {
        private double lat;
        private double lng;
    }
}
