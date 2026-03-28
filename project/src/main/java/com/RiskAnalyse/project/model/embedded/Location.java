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

    // ✅ Always call this before saving
    public void generateCoordinates() {
        this.coordinates = Arrays.asList(lng, lat); // ⚠️ order: [lng, lat]
    }
}