package com.RiskAnalyse.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HeatmapResponse {

    private double lat;
    private double lng;
    private double intensity;
}