package com.RiskAnalyse.project.dto.request;


import lombok.Data;

@Data
public class RouteRequest {

    private String source;
    private String destination;
    private String mode;   // walk, cab, transit
    private int hour;
}
