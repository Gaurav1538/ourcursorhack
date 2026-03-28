package com.RiskAnalyse.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafeRoutePoint {

    private double lat;
    private double lng;
    private double riskScore;
}
