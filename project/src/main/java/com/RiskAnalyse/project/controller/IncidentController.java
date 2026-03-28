package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.request.IncidentRequest;
import com.RiskAnalyse.project.dto.response.IncidentResponse;
import com.RiskAnalyse.project.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin("*")
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    // ✅ POST
    @PostMapping
    public IncidentResponse report(@RequestBody IncidentRequest request) {
        return service.report(request);
    }

    // ✅ GET
    @GetMapping
    public List<IncidentResponse> getAll() {
        return service.getAll();
    }
    @GetMapping("/nearby")
    public List<IncidentResponse> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2") double radius
    ) {
        return service.getNearby(lat, lng, radius);
    }
}