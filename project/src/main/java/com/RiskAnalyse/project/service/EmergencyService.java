package com.RiskAnalyse.project.service;


import com.RiskAnalyse.project.dto.response.EmergencyResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Service
public class EmergencyService {

    private static final String[] HOSPITALS = {
            "District Hospital",
            "Regional Medical Center",
            "City General Hospital",
            "Trauma & Emergency Unit",
            "Community Health Center",
            "Metropolitan Medical",
            "Central Care Hospital",
            "Northside Medical",
    };

    private static final String[] POLICE = {
            "City Police Headquarters",
            "Metro Safety Office",
            "Central Police Post",
            "North Precinct",
            "Traffic & Patrol Unit",
            "Community Police Desk",
            "Municipal Police Station",
    };

    /**
     * Lists vary by coordinates (or city string) so they are not always AIIMS/Delhi.
     * Integrate Places/OSM later; this is deterministic demo data.
     */
    public List<EmergencyResponse> getNearby(String city, Double lat, Double lon) {
        long seed = 0x9E3779B97F4A7C15L;
        if (lat != null && lon != null) {
            seed ^= Double.doubleToLongBits(lat);
            seed ^= Double.doubleToLongBits(lon) << 1;
        }
        if (city != null && !city.isBlank()) {
            seed ^= (long) city.toLowerCase(Locale.ROOT).hashCode() << 32;
        }
        Random rnd = new Random(seed);

        int hi = rnd.nextInt(HOSPITALS.length);
        int pi = rnd.nextInt(POLICE.length);

        double km1 = round1(0.5 + rnd.nextDouble() * 3.2);
        double km2 = round1(0.4 + rnd.nextDouble() * 2.8);
        int eta1 = 3 + rnd.nextInt(18);
        int eta2 = 2 + rnd.nextInt(15);

        List<EmergencyResponse> out = new ArrayList<>();
        out.add(EmergencyResponse.builder()
                .name(HOSPITALS[hi])
                .type("hospital")
                .distance(km1 + " km")
                .eta(eta1 + " mins")
                .build());
        out.add(EmergencyResponse.builder()
                .name(POLICE[pi])
                .type("police")
                .distance(km2 + " km")
                .eta(eta2 + " mins")
                .build());
        return out;
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
