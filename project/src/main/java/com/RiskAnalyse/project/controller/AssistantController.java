package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.request.ChatRequest;
import com.RiskAnalyse.project.dto.response.ChatResponse;
import com.RiskAnalyse.project.service.AssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
@CrossOrigin
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = assistantService.generateReply(
                request != null ? request.getMessage() : null,
                request != null ? request.getContext() : null
        );

        return ChatResponse.builder()
                .reply(reply)
                .build();
    }
}
