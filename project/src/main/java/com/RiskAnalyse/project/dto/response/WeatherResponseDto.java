package com.RiskAnalyse.project.dto.response;

import lombok.Data;

@Data
public class WeatherResponseDto {

    private String day;        // was date ❌
    private String city;
    private String country;

    private String temperature;
    private String weather;    // was condition ❌

    private String wind;
    private String humidity;

    private String uvIndex;    // camelCase for Java
}