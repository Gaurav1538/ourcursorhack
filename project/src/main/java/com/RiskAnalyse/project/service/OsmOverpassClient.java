package com.RiskAnalyse.project.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Fetches nearby emergency-related POIs from OpenStreetMap via the public Overpass API.
 * Failures return an empty list so callers can fall back to synthetic data.
 */
@Component
public class OsmOverpassClient {

    private static final String OVERPASS_URL = "https://overpass-api.de/api/interpreter";
    private static final String USER_AGENT = "DigitalSentinel/1.0 (safety demo; contact: none)";

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(6))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<OsmNode> fetchEmergencyNodes(double lat, double lon, int radiusMeters) {
        String overpassQl = String.format(
                "[out:json][timeout:12];"
                        + "("
                        + "node[\"amenity\"=\"hospital\"](around:%d,%.7f,%.7f);"
                        + "node[\"amenity\"=\"clinic\"](around:%d,%.7f,%.7f);"
                        + "node[\"amenity\"=\"police\"](around:%d,%.7f,%.7f);"
                        + "node[\"amenity\"=\"fire_station\"](around:%d,%.7f,%.7f);"
                        + ");"
                        + "out body 25;",
                radiusMeters, lat, lon,
                radiusMeters, lat, lon,
                radiusMeters, lat, lon,
                radiusMeters, lat, lon
        );

        try {
            String form = "data=" + java.net.URLEncoder.encode(overpassQl, java.nio.charset.StandardCharsets.UTF_8);
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(OVERPASS_URL))
                    .timeout(Duration.ofSeconds(14))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("User-Agent", USER_AGENT)
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() != 200 || res.body() == null || res.body().isBlank()) {
                return List.of();
            }
            return parse(res.body());
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<OsmNode> parse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode elements = root.path("elements");
            if (!elements.isArray()) {
                return List.of();
            }
            List<OsmNode> out = new ArrayList<>();
            for (JsonNode el : elements) {
                if (!"node".equals(el.path("type").asText())) {
                    continue;
                }
                double nlat = el.path("lat").asDouble(Double.NaN);
                double nlon = el.path("lon").asDouble(Double.NaN);
                if (Double.isNaN(nlat) || Double.isNaN(nlon)) {
                    continue;
                }
                JsonNode tags = el.path("tags");
                String amenity = tags.path("amenity").asText("");
                if (amenity.isBlank()) {
                    continue;
                }
                String name = tags.path("name").asText("");
                if (name.isBlank()) {
                    name = tags.path("operator").asText("");
                }
                String addr = buildAddress(tags);
                out.add(new OsmNode(nlat, nlon, amenity, name.isBlank() ? defaultName(amenity) : name, addr));
            }
            return out;
        } catch (Exception e) {
            return List.of();
        }
    }

    private static String buildAddress(JsonNode tags) {
        String street = tags.path("addr:street").asText("");
        String hn = tags.path("addr:housenumber").asText("");
        String city = tags.path("addr:city").asText("");
        StringBuilder sb = new StringBuilder();
        if (!street.isBlank()) {
            sb.append(street);
            if (!hn.isBlank()) {
                sb.append(" ").append(hn);
            }
        }
        if (!city.isBlank()) {
            if (sb.length() > 0) {
                sb.append(", ");
            }
            sb.append(city);
        }
        return sb.length() > 0 ? sb.toString() : null;
    }

    private static String defaultName(String amenity) {
        return switch (amenity) {
            case "hospital", "clinic" -> "Medical facility";
            case "police" -> "Police";
            case "fire_station" -> "Fire station";
            default -> "Emergency services";
        };
    }

    public record OsmNode(double lat, double lon, String amenity, String name, String address) {
    }
}
