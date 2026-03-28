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

    // 🔥 Add this for MongoDB GeoJSON
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private List<Double> coordinates;

    private String type = "Point";

    // 🔥 Helper method
    public void generateCoordinates() {
        this.coordinates = Arrays.asList(lng, lat);
    }
}