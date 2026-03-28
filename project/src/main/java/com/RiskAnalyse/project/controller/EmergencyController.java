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
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "10000") Integer radiusMeters
    ) {
        int r = radiusMeters != null && radiusMeters > 500 && radiusMeters < 500_000
                ? radiusMeters
                : 10_000;
        return emergencyService.getNearby(city, lat, lon, r);
    }

    /** Convenience endpoint when you only have coordinates (same data as GET / with city "Near you"). */
    @GetMapping("/nearby")
    public List<EmergencyResponse> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false, defaultValue = "10000") Integer radiusMeters
    ) {
        int r = radiusMeters != null && radiusMeters > 500 && radiusMeters < 500_000
                ? radiusMeters
                : 10_000;
        return emergencyService.getNearby("Near you", lat, lng, r);
    }
}
