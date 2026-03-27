package com.RiskAnalyse.project.service;


import org.springframework.stereotype.Service;

@Service
public class AssistantService {

    public String generateReply(String message) {

        message = message.toLowerCase();

        if (message.contains("safe")) {
            return "This area is moderately safe. Avoid isolated streets at night.";
        }

        if (message.contains("night")) {
            return "Travel during night hours carries higher risk. Prefer cabs.";
        }

        if (message.contains("transport")) {
            return "Use verified ride services like Uber or Ola.";
        }

        return "Stay alert and follow basic safety precautions.";
    }
}
