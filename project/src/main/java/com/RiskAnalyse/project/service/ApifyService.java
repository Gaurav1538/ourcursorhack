package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.response.NewsResponseDto;
import com.RiskAnalyse.project.util.NewsFilterUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApifyService {

    @Value("${apify.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<NewsResponseDto> getCrimeNews(String city) {

        try {
            String url = "https://api.apify.com/v2/acts/lhotanova~google-news-scraper/"
                    + "run-sync-get-dataset-items?token=" + apiToken;

            // 🔥 Dynamic query
            String requestBody = """
        {
            "query": "%s crime",
            "fetchArticleDetails": true,
            "language": "US:en",
            "maxItems": 50,
            "proxyConfiguration": {
                "useApifyProxy": true
            }
        }
        """.formatted(city);

            // HEADERS
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());

            List<NewsResponseDto> result = new ArrayList<>();

            for (JsonNode node : root) {

                String title = node.path("title").asText("");
                String link = node.path("link").asText("");
                String source = node.path("source").asText("unknown");
                String publishedAt = node.path("publishedAt").asText("");
                String image = node.path("image").asText(null);

                // 🔥 EXTRA FILTER (location-based)
                if (!title.toLowerCase().contains(city.toLowerCase())) {
                    continue;
                }

                if (!NewsFilterUtil.isRelevant(title)) {
                    continue;
                }

                NewsResponseDto news = new NewsResponseDto(
                        title,
                        link,
                        source,
                        publishedAt,
                        image
                );

                result.add(news);
            }

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching location-based news", e);
        }
    }
}