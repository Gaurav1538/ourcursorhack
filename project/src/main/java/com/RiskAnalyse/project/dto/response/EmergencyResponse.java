package com.RiskAnalyse.project.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmergencyResponse {

    private String name;
    private String type;     // hospital, police
    private String distance; // mock
    private String eta;
}