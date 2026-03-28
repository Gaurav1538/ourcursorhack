package com.RiskAnalyse.project.controller;



import com.RiskAnalyse.project.dto.request.RouteRequest;
import com.RiskAnalyse.project.dto.response.RouteResponse;
import com.RiskAnalyse.project.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
@CrossOrigin
public class RouteController {

    private final RouteService routeService;

    @PostMapping("/analyze")
    public RouteResponse analyze(@RequestBody RouteRequest request) {
        return routeService.analyzeRoute(request);
    }
}
