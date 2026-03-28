package com.RiskAnalyse.project.service;


import com.RiskAnalyse.project.dto.response.EmergencyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final OsmOverpassClient osmOverpassClient;

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

    private static final String[] FIRE = {
            "Central Fire Station",
            "District Fire & Rescue",
            "Metro Fire Department",
    };

    public List<EmergencyResponse> getNearby(String city, Double lat, Double lon, int radiusMeters) {
        if (lat != null && lon != null) {
            List<EmergencyResponse> fromOsm = fromOsm(lat, lon, radiusMeters);
            if (!fromOsm.isEmpty()) {
                return mergeWithSyntheticIfNeeded(fromOsm, lat, lon, city);
            }
            return syntheticWithRealCoords(lat, lon, city);
        }
        return syntheticCityOnly(city, lat, lon);
    }

    private List<EmergencyResponse> fromOsm(double lat, double lon, int radiusMeters) {
        List<OsmOverpassClient.OsmNode> nodes = osmOverpassClient.fetchEmergencyNodes(lat, lon, radiusMeters);
        List<EmergencyResponse> list = new ArrayList<>();
        for (OsmOverpassClient.OsmNode n : nodes) {
            double km = haversineKm(lat, lon, n.lat(), n.lon());
            int mins = etaMinutesForKm(km);
            String type = mapAmenityToType(n.amenity());
            list.add(EmergencyResponse.builder()
                    .name(n.name())
                    .type(type)
                    .distance(formatKm(km))
                    .eta(mins + " mins")
                    .lat(n.lat())
                    .lon(n.lon())
                    .distanceKm(round1(km))
                    .etaMinutes(mins)
                    .source("osm")
                    .address(n.address())
                    .build());
        }
        list.sort(Comparator.comparingDouble(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 9999));
        return list.stream().limit(12).toList();
    }

    private static List<EmergencyResponse> mergeWithSyntheticIfNeeded(
            List<EmergencyResponse> fromOsm, double lat, double lon, String city
    ) {
        boolean hasHospital = fromOsm.stream().anyMatch(r -> "hospital".equals(r.getType()));
        boolean hasPolice = fromOsm.stream().anyMatch(r -> "police".equals(r.getType()));
        List<EmergencyResponse> out = new ArrayList<>(fromOsm);
        Random rnd = seededRandom(city, lat, lon);
        if (!hasHospital) {
            out.add(syntheticOne(lat, lon, rnd, "hospital", HOSPITALS[rnd.nextInt(HOSPITALS.length)]));
        }
        if (!hasPolice) {
            out.add(syntheticOne(lat, lon, rnd, "police", POLICE[rnd.nextInt(POLICE.length)]));
        }
        out.sort(Comparator.comparingDouble(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 9999));
        return dedupeByCoords(out, 8);
    }

    private static List<EmergencyResponse> dedupeByCoords(List<EmergencyResponse> items, int max) {
        Set<String> seen = new LinkedHashSet<>();
        List<EmergencyResponse> out = new ArrayList<>();
        for (EmergencyResponse r : items) {
            if (r.getLat() == null || r.getLon() == null) {
                continue;
            }
            String key = String.format(Locale.ROOT, "%.4f,%.4f", r.getLat(), r.getLon());
            if (seen.add(key) && out.size() < max) {
                out.add(r);
            }
        }
        return out;
    }

    private List<EmergencyResponse> syntheticWithRealCoords(double lat, double lon, String city) {
        Random rnd = seededRandom(city, lat, lon);
        List<EmergencyResponse> out = new ArrayList<>();
        out.add(syntheticOne(lat, lon, rnd, "hospital", HOSPITALS[rnd.nextInt(HOSPITALS.length)]));
        out.add(syntheticOne(lat, lon, rnd, "police", POLICE[rnd.nextInt(POLICE.length)]));
        out.add(syntheticOne(lat, lon, rnd, "fire", FIRE[rnd.nextInt(FIRE.length)]));
        out.sort(Comparator.comparingDouble(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 9999));
        return out;
    }

    private static EmergencyResponse syntheticOne(double userLat, double userLon, Random rnd, String type, String name) {
        double bearing = rnd.nextDouble() * 2 * Math.PI;
        double distKm = 0.35 + rnd.nextDouble() * 2.8;
        double[] dest = destinationLatLon(userLat, userLon, distKm, bearing);
        double km = haversineKm(userLat, userLon, dest[0], dest[1]);
        int mins = etaMinutesForKm(km);
        return EmergencyResponse.builder()
                .name(name)
                .type(type)
                .distance(formatKm(km))
                .eta(mins + " mins")
                .lat(dest[0])
                .lon(dest[1])
                .distanceKm(round1(km))
                .etaMinutes(mins)
                .source("synthetic")
                .build();
    }

    private List<EmergencyResponse> syntheticCityOnly(String city, Double lat, Double lon) {
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
        int eta1 = etaMinutesForKm(km1);
        int eta2 = etaMinutesForKm(km2);

        List<EmergencyResponse> out = new ArrayList<>();
        out.add(EmergencyResponse.builder()
                .name(HOSPITALS[hi])
                .type("hospital")
                .distance(formatKm(km1))
                .eta(eta1 + " mins")
                .distanceKm(km1)
                .etaMinutes(eta1)
                .source("synthetic")
                .build());
        out.add(EmergencyResponse.builder()
                .name(POLICE[pi])
                .type("police")
                .distance(formatKm(km2))
                .eta(eta2 + " mins")
                .distanceKm(km2)
                .etaMinutes(eta2)
                .source("synthetic")
                .build());
        return out;
    }

    private static Random seededRandom(String city, double lat, double lon) {
        long seed = Double.doubleToLongBits(lat) ^ (Double.doubleToLongBits(lon) << 1);
        if (city != null && !city.isBlank()) {
            seed ^= (long) city.toLowerCase(Locale.ROOT).hashCode() << 32;
        }
        return new Random(seed);
    }

    private static String mapAmenityToType(String amenity) {
        if (amenity == null) {
            return "hospital";
        }
        return switch (amenity) {
            case "police" -> "police";
            case "fire_station" -> "fire";
            default -> "hospital";
        };
    }

    private static String formatKm(double km) {
        return round1(km) + " km";
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private static int etaMinutesForKm(double km) {
        if (km <= 0) {
            return 3;
        }
        double kph = 28.0;
        int mins = (int) Math.round(km / kph * 60.0);
        return Math.max(2, Math.min(45, mins));
    }

    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static double[] destinationLatLon(double latDeg, double lonDeg, double distanceKm, double bearingRad) {
        double R = 6371.0;
        double δ = distanceKm / R;
        double φ1 = Math.toRadians(latDeg);
        double λ1 = Math.toRadians(lonDeg);
        double φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(bearingRad));
        double λ2 = λ1 + Math.atan2(
                Math.sin(bearingRad) * Math.sin(δ) * Math.cos(φ1),
                Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
        );
        return new double[]{Math.toDegrees(φ2), Math.toDegrees(λ2)};
    }
}
