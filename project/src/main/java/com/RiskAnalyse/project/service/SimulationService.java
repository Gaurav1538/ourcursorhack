package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.model.Incident;
import com.RiskAnalyse.project.model.embedded.Location;
import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class SimulationService {

    private final IncidentRepository repository;
    private final Random random = new Random();

    public SimulationService(IncidentRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedRate = 60000) // every 1 min
    public void generateFakeIncident() {

        Incident i = new Incident();

        Location loc = new Location();
        loc.setLat(34.08 + random.nextDouble() * 0.01);
        loc.setLng(74.79 + random.nextDouble() * 0.01);
        loc.generateCoordinates();

        i.setType("SIMULATED");
        i.setDescription("Auto-generated event");
        i.setLocation(loc);
        i.setSeverity(random.nextInt(5) + 1);
        i.setTimestamp(Instant.now());
        i.setReportedBy("SYSTEM");
        i.setVerified(true);

        repository.save(i);
    }
}