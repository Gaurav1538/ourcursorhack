package com.RiskAnalyse.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HeatmapPoint {

    private double lat;
    private double lng;
    private double risk;
}