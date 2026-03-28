package com.RiskAnalyse.project.controller;



import com.RiskAnalyse.project.dto.response.EmergencyResponse;
import com.RiskAnalyse.project.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin
public class EmergencyController {

    private final EmergencyService emergencyService;

    @GetMapping
    public List<EmergencyResponse> getEmergency(
            @RequestParam String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon
    ) {
        return emergencyService.getNearby(city, lat, lon);
    }
}
