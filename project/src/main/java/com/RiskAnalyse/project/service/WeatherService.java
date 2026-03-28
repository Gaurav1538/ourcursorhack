package com.RiskAnalyse.project.service;

import com.RiskAnalyse.project.dto.response.WeatherResponseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class WeatherService {

    @Value("${apify.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<WeatherResponseDto> getWeather(String city) {

        try {

            // 🔥 1. Apify endpoint
            String url = "https://api.apify.com/v2/acts/accelerationengg~weather-forecast/run-sync-get-dataset-items?token="
                    + apiToken;

            // 🔥 2. Build dynamic URL (VERY IMPORTANT)
            String weatherUrl = buildWeatherUrl(city);

            // 🔥 3. Correct request body (startUrls)
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, String> urlMap = new HashMap<>();
            urlMap.put("url", weatherUrl);

            List<Map<String, String>> startUrls = new ArrayList<>();
            startUrls.add(urlMap);

            requestBody.put("startUrls", startUrls);

            // 🔍 DEBUG
            System.out.println("City: " + city);
            System.out.println("Generated URL: " + weatherUrl);
            System.out.println("Request Body: " + requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(requestBody, headers);

            // 🔥 4. Call Apify
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            System.out.println("RAW RESPONSE: " + response.getBody());

            // 🔥 5. Parse response
            JsonNode root = mapper.readTree(response.getBody());

            List<WeatherResponseDto> result = new ArrayList<>();

            for (JsonNode node : root) {

                WeatherResponseDto weather = new WeatherResponseDto();

                weather.setDay(getSafe(node, "day"));
                weather.setCity(getSafe(node, "city"));
                weather.setCountry(getSafe(node, "country"));

                weather.setTemperature(getSafe(node, "temperature"));
                weather.setWeather(getSafe(node, "weather"));

                weather.setWind(getSafe(node, "wind"));
                weather.setHumidity(getSafe(node, "humidity"));

                weather.setUvIndex(getSafe(node, "uv_index"));

                result.add(weather);
            }

            System.out.println("Weather fetched for city: " + city +
                    " | Records: " + result.size());

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching weather", e);
        }
    }

    // 🔥 Build correct URL for actor
    private String buildWeatherUrl(String city) {

        city = city.toLowerCase().trim().replace(" ", "-");

        // Optional fix for tricky cities
        if (city.equals("srinagar")) {
            return "https://www.timeanddate.com/weather/india/srinagar-jammu-and-kashmir/ext";
        }

        return "https://www.timeanddate.com/weather/india/" + city + "/ext";
    }

    // 🔧 Safe JSON parser
    private String getSafe(JsonNode node, String key) {
        return node.has(key) ? node.get(key).asText() : "";
    }
}