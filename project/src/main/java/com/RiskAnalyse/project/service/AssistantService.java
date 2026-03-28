package com.RiskAnalyse.project.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantService {

    private final ChatClient chatClient;

    public AssistantService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    // 🔥 Allowed topics
    private final List<String> allowedKeywords = List.of(
            "safe", "safety", "crime", "risk",
            "travel", "route", "location",
            "area", "night", "transport"
    );

    public String generateReply(String message) {

        if (message == null || message.isEmpty()) {
            return "Please ask something related to safety or travel.";
        }

        message = message.toLowerCase();

        // 🔥 STEP 1: Check allowed domain
        boolean isAllowed = allowedKeywords.stream()
                .anyMatch(message::contains);

        if (!isAllowed) {
            return "Sorry, I can’t help you with that. Ask only about safety, travel, or location.";
        }

        // 🔥 STEP 2: Use AI (Spring AI)
        String prompt = """
        You are an AI Safety Assistant.

        Rules:
        - Answer ONLY about safety, travel, crime, and location.
        - Keep answers short (2-3 lines).
        - Give practical advice.
        - Do NOT answer unrelated questions.

        User Question:
        %s
        """.formatted(message);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
