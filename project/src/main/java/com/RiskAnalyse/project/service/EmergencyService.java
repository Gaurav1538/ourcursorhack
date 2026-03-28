package com.RiskAnalyse.project.service;


import com.RiskAnalyse.project.dto.response.EmergencyResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    public List<EmergencyResponse> getNearby(String city) {

        // mock data (can later integrate Google Places API)

        return List.of(
                EmergencyResponse.builder()
                        .name("AIIMS Hospital")
                        .type("hospital")
                        .distance("1.2 km")
                        .eta("5 mins")
                        .build(),

                EmergencyResponse.builder()
                        .name("Delhi Police Station")
                        .type("police")
                        .distance("0.8 km")
                        .eta("3 mins")
                        .build()
        );
    }
}