package com.RiskAnalyse.project.data;

import com.RiskAnalyse.project.model.Incident;
import com.RiskAnalyse.project.model.embedded.Location;
import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;

@Component
public class CrimeDataLoader implements CommandLineRunner {

    private final IncidentRepository repository;

    public CrimeDataLoader(IncidentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {

        if (repository.count() > 0) return;

        Incident i = new Incident();

        Location loc = new Location();
        loc.setLat(34.0837);
        loc.setLng(74.7973);
        loc.generateCoordinates();

        i.setType("THEFT");
        i.setDescription("Historical crime data");
        i.setLocation(loc);
        i.setSeverity(3);
        i.setTimestamp(Instant.now().minusSeconds(86400));
        i.setReportedBy("NCRB");
        i.setVerified(true);

        repository.save(i);
    }
}