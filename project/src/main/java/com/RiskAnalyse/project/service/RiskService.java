package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.model.Incident;
import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
public class RiskService {

    private final IncidentRepository repository;
    private final Random random = new Random();

    public RiskService(IncidentRepository repository) {
        this.repository = repository;
    }

    public double calculateRisk(double lat, double lng) {

        double radiusKm = 3;
        double maxDistance = radiusKm * 1000;

        List<Incident> incidents =
                repository.findNearbyLimited(lng, lat, maxDistance);

        double risk = 0;

        for (Incident i : incidents) {

            double distance = distance(
                    lat, lng,
                    i.getLocation().getLat(),
                    i.getLocation().getLng()
            );

            // 🔥 Distance weight
            double distanceWeight =
                    Math.max(0.5, (radiusKm - distance) / radiusKm);

            // 🔥 Severity
            double severityWeight = i.getSeverity();

            // 🔥 Time decay
            long hoursAgo = ChronoUnit.HOURS.between(
                    i.getTimestamp(), Instant.now());

            double timeDecay =
                    Math.max(0.2, 1.0 / (1 + hoursAgo * 0.1));

            risk += severityWeight * distanceWeight * timeDecay;
        }

        // 🌙 Night boost
        int hour = Instant.now()
                .atZone(java.time.ZoneId.systemDefault())
                .getHour();

        double nightFactor =
                (hour >= 20 || hour <= 5) ? 1.5 : 1.0;

        risk *= nightFactor;

        // 🎲 Random factor
        risk += random.nextDouble() * 2;

        // 🎯 Normalize
        double normalized = 100 * (1 - Math.exp(-risk / 10));
        return Math.min(100, normalized);
    }

    // 📍 Haversine formula
    private double distance(double lat1, double lon1,
                            double lat2, double lon2) {

        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2)
                * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}