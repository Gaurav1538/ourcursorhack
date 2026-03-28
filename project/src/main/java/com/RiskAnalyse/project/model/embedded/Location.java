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

<<<<<<< HEAD
    // 🔥 Add this for MongoDB GeoJSON
=======
    // 🔥 MongoDB GeoJSON (REQUIRED for $near queries)
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private List<Double> coordinates;

    private String type = "Point";

<<<<<<< HEAD
    // 🔥 Helper method
    public void generateCoordinates() {
        this.coordinates = Arrays.asList(lng, lat);
=======
    // ✅ Always call this before saving
    public void generateCoordinates() {
        this.coordinates = Arrays.asList(lng, lat); // ⚠️ order: [lng, lat]
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
    }
}