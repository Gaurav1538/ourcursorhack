package com.RiskAnalyse.project.dto.request;

import lombok.Data;

@Data
public class IncidentRequest {

    private String type;
    private String description;

    private double lat;
    private double lng;

    private int severity;
    private String reportedBy;
}