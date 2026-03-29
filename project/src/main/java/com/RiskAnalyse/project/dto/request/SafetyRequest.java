package com.RiskAnalyse.project.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SafetyRequest {

    @NotBlank
    private String city;

    @NotBlank
    private String area;

    private int hour;        // 0–23
    private String profile;  // solo, female, family, student

    /** When set, analysis uses the live risk engine for this point (recommended). */
    private Double lat;
    private Double lng;
}