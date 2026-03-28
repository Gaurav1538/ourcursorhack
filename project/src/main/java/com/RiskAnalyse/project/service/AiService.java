package com.RiskAnalyse.project.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AiService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiService(ChatClient chatClient, ObjectMapper objectMapper) {
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
    }

    public String explainRisk(double lat, double lng, double risk) {

        String prompt = """
        You are a safety AI.

        Location: (%f, %f)
        Risk Score: %.2f

        Explain why this area might be risky in simple terms.
        Keep it short (2-3 lines).
        """.formatted(lat, lng, risk);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String suggestSafety(double lat, double lng, double risk) {

        String prompt = """
        You are a safety assistant.

        Location: (%f, %f)
        Risk Score: %.2f

        Suggest safety tips and precautions.
        """.formatted(lat, lng, risk);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String chat(String userInput) {

        String prompt = """
    You are an AI Safety Assistant.

    Answer user questions about safety, crime, and precautions.
    Keep answers short and helpful.

    Question: %s
    """.formatted(userInput);

        return chatClient.prompt(prompt).call().content();
    }

    /**
     * Builds one user message from a free-form prompt plus optional structured context (for maps, routes, etc.).
     */
    public String chatWithContext(String prompt, Map<String, Object> context) {
        String p = prompt == null ? "" : prompt.trim();
        if (p.isEmpty()) {
            p = "Give a brief safety tip.";
        }
        if (context == null || context.isEmpty()) {
            return chat(p);
        }
        try {
            String json = objectMapper.writeValueAsString(context);
            String augmented = p + "\n\nStructured context (JSON):\n" + json;
            return chat(augmented);
        } catch (JsonProcessingException e) {
            return chat(p);
        }
    }
}