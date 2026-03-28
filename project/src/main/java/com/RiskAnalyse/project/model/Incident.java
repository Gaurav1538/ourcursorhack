package com.RiskAnalyse.project.model;

import com.RiskAnalyse.project.model.embedded.Location;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "incidents")
public class Incident {

    @Id
    private String id;

    private String type;
    private String description;

    private Location location;

    private int severity;
    private Instant timestamp;

    private String reportedBy;
    private boolean verified;
}