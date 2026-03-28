package com.RiskAnalyse.project.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class AiAskRequest {

    private String prompt;
    private Map<String, Object> context;
}
