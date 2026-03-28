package com.RiskAnalyse.project.controller;



import com.RiskAnalyse.project.dto.request.SafetyRequest;
import com.RiskAnalyse.project.dto.response.SafetyResponse;
import com.RiskAnalyse.project.service.SafetyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/safety")
@RequiredArgsConstructor
@CrossOrigin
public class SafetyController {

    private final SafetyService safetyService;

    @PostMapping("/analyze")
    public SafetyResponse analyze(@Valid @RequestBody SafetyRequest request) {
        return safetyService.analyze(request);
    }
}
