package com.RiskAnalyse.project.dto.request;


import lombok.Data;

@Data
public class RouteRequest {

    private String source;
    private String destination;
    private String mode;   // walking, driving, transit
    private int hour;
    /** Optional — when set, ETA / hotspots follow this path */
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
}
