package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.model.Incident;
import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RiskService {

    private final AlertService alertService;
    private final IncidentRepository repository;

    public RiskService(IncidentRepository repository,AlertService alertService) {
        this.repository = repository;
        this.alertService=alertService;
    }

    public double calculateRisk(double lat, double lng) {

        double radiusKm = 3;
        double maxDistance = radiusKm * 1000;

        List<Incident> incidents =
                repository.findNearbyLimited(lng, lat, maxDistance);

        double risk = 0;

        for (Incident i : incidents) {

            var loc = i.getLocation();
            if (loc == null) {
                continue;
            }
            double distance = distance(
                    lat, lng,
                    loc.resolveLat(),
                    loc.resolveLng()
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

        alertService.checkAndAlert(risk, lat, lng);
        // 🎯 Normalize incident-driven risk (0–100, higher = more risk)
        double fromIncidents = 100 * (1 - Math.exp(-risk / 10));
        /*
         * With no incidents in range, exp(0) would imply 0 risk → every location reads as
         * "perfectly safe". Use a modest, deterministic prior from coordinates instead.
         */
        if (incidents.isEmpty()) {
            double prior = locationPriorRisk(lat, lng);
            if (nightFactor > 1.0) {
                prior = Math.min(100, prior * 1.1);
            }
            return Math.min(100, Math.max(fromIncidents, prior));
        }
        return Math.min(100, fromIncidents);
    }

    /**
     * Stable 10–40 risk index when there is no local incident signal, so different
     * map positions do not all collapse to the same score.
     */
    private static double locationPriorRisk(double lat, double lng) {
        int qLat = (int) Math.round(lat * 500);
        int qLng = (int) Math.round(lng * 500);
        long h = (long) qLat * 0x9E3779B9L ^ (long) qLng * 0x85EBCA6BL;
        h ^= h >>> 32;
        h *= 0xC2B2AE3D3334L;
        h ^= h >>> 29;
        double u = (h & ((1L << 53) - 1)) / (double) (1L << 53);
        return 10 + u * 30;
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