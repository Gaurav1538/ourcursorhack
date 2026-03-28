package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.request.IncidentRequest;
import com.RiskAnalyse.project.dto.response.IncidentResponse;
import com.RiskAnalyse.project.model.Incident;
import com.RiskAnalyse.project.model.embedded.Location;
import com.RiskAnalyse.project.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository repository;

    public IncidentService(IncidentRepository repository) {
        this.repository = repository;
    }

    // 🔥 CREATE INCIDENT
    public IncidentResponse report(IncidentRequest request) {

        Location location = new Location();
        location.setLat(request.getLat());
        location.setLng(request.getLng());
        location.generateCoordinates(); // IMPORTANT

        Incident incident = new Incident();
        incident.setType(request.getType());
        incident.setDescription(request.getDescription());
        incident.setLocation(location);
        incident.setSeverity(request.getSeverity());
        incident.setTimestamp(Instant.now());
        incident.setReportedBy(request.getReportedBy());
        incident.setVerified(false);

        Incident saved = repository.save(incident);

        return mapToResponse(saved);
    }

    // 🔥 GET ALL INCIDENTS
    public List<IncidentResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 🔁 MAPPER
    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse res = new IncidentResponse();

        res.setId(incident.getId());
        res.setType(incident.getType());
        res.setDescription(incident.getDescription());
        res.setLat(incident.getLocation().getLat());
        res.setLng(incident.getLocation().getLng());
        res.setSeverity(incident.getSeverity());
        res.setTimestamp(incident.getTimestamp());

        return res;
    }
    public List<IncidentResponse> getNearby(double lat, double lng, double radiusKm) {

        double maxDistance = radiusKm * 1000; // km → meters

        List<Incident> incidents = repository.findNearby(lng, lat, maxDistance);

        return incidents.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}