package com.RiskAnalyse.project.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmergencyResponse {

    private String name;
    /** hospital | police | fire */
    private String type;
    /** Legacy display, e.g. "1.2 km" */
    private String distance;
    /** Legacy display, e.g. "8 mins" */
    private String eta;

    private Double lat;
    private Double lon;
    private Double distanceKm;
    private Integer etaMinutes;
    /** "osm" when from OpenStreetMap, "synthetic" when generated */
    private String source;
    private String address;
}