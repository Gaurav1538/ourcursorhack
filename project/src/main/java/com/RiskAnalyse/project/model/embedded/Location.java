package com.RiskAnalyse.project.model.embedded;

import lombok.Data;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;

import java.util.Arrays;
import java.util.List;

@Data
public class Location {

    private double lat;
    private double lng;

    // 🔥 MongoDB GeoJSON (REQUIRED for $near queries)
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private List<Double> coordinates;

    private String type = "Point";

    // 🔥 Helper method
    public void generateCoordinates() {
        this.coordinates = Arrays.asList(lng, lat);
    }

    /**
     * Lat/lng used for distance math must match GeoJSON {@code coordinates} ([lng, lat]),
     * otherwise Mongo {@code $near} and Haversine disagree and every incident can appear at (0,0).
     */
    public double resolveLat() {
        if (coordinates != null && coordinates.size() >= 2 && coordinates.get(1) != null) {
            return coordinates.get(1);
        }
        return lat;
    }

    public double resolveLng() {
        if (coordinates != null && coordinates.size() >= 2 && coordinates.get(0) != null) {
            return coordinates.get(0);
        }
        return lng;
    }
}