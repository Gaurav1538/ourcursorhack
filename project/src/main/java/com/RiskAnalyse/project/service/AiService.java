package com.RiskAnalyse.project.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient chatClient) {
        this.chatClient = chatClient;
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
}