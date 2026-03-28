package com.RiskAnalyse.project.dto.response;

import lombok.Data;

import java.time.Instant;

@Data
public class IncidentResponse {

    private String id;
    private String type;
    private String description;

    private double lat;
    private double lng;

    private int severity;
    private Instant timestamp;
}