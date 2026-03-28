package com.RiskAnalyse.project.controller;

import com.RiskAnalyse.project.dto.request.AiAskRequest;
import com.RiskAnalyse.project.dto.response.AiAskResponse;
import com.RiskAnalyse.project.service.AiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /** Legacy GET — returns JSON for consistency with the SPA. */
    @GetMapping("/ask")
    public AiAskResponse askGet(@RequestParam String question) {
        return new AiAskResponse(aiService.chat(question));
    }

    /** Primary contract for the React app: POST JSON body. */
    @PostMapping("/ask")
    public AiAskResponse askPost(@RequestBody AiAskRequest body) {
        String answer = aiService.chatWithContext(
                body != null ? body.getPrompt() : null,
                body != null ? body.getContext() : null
        );
        return new AiAskResponse(answer);
    }
}
