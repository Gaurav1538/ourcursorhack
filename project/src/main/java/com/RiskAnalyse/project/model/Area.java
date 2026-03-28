package com.RiskAnalyse.project.model;



import com.RiskAnalyse.project.model.embedded.CrimeData;
import com.RiskAnalyse.project.model.embedded.Location;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "areas")
public class Area {

    @Id
    private String id;

    private String city;
    private String areaName;

    private double areaRisk;
    private double emergencyScore;

    private Location location;
    private CrimeData crimeData;
}
