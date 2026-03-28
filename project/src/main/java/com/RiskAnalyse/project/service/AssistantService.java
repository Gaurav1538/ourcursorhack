package com.RiskAnalyse.project.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AssistantService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AssistantService(ChatClient chatClient, ObjectMapper objectMapper) {
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
    }

    private final List<String> allowedKeywords = List.of(
            "safe", "safety", "crime", "risk", "danger", "dangerous", "secure",
            "travel", "route", "trip", "walk", "walking", "drive", "driving", "transit", "bus", "train", "metro", "taxi", "uber",
            "location", "area", "place", "neighborhood", "street", "park", "station",
            "night", "dark", "evening", "morning", "late",
            "weather", "rain", "cold", "wind",
            "alone", "solo", "group", "friend", "women", "woman",
            "help", "advice", "tip", "tips", "what", "how", "should", "watch", "avoid",
            "emergency", "police", "hospital", "map", "sentinel",
            "headphone", "phone", "light", "lighting", "cctv", "crowd", "quiet"
    );

    public String generateReply(String rawMessage, Map<String, Object> context) {

        if (rawMessage == null || rawMessage.isBlank()) {
            return "Ask something about safety, your trip, or the area you’re viewing — I’ll tailor the answer.";
        }

        String trimmed = rawMessage.trim();
        String lower = trimmed.toLowerCase(Locale.ROOT);

        boolean hasContext = context != null && !context.isEmpty();
        boolean keywordMatch = allowedKeywords.stream().anyMatch(lower::contains);

        if (!keywordMatch && !hasContext) {
            return "I’m tuned for safety and travel. For example: “Is it OK to walk here after dark?” or “What should I watch for near transit?” — or run a safety check so I can use your trip context.";
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("""
                You are Sentinel, a concise safety assistant for urban travel.

                Rules:
                - Answer the user’s actual question; vary wording each time — do not repeat canned phrases.
                - Use 2–5 short sentences unless they ask for a list.
                - Ground advice in the user’s message. If context JSON is provided, reference destination, profile, mode, or score when relevant.
                - Stay on safety, awareness, routes, and place risk — politely decline unrelated topics in one sentence.

                User message:
                """).append(trimmed);

        if (hasContext) {
            try {
                prompt.append("\n\nContext (JSON):\n")
                        .append(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(context));
            } catch (JsonProcessingException e) {
                prompt.append("\n\nContext: ").append(context.toString());
            }
        }

        return chatClient.prompt()
                .user(prompt.toString())
                .call()
                .content();
    }
}
