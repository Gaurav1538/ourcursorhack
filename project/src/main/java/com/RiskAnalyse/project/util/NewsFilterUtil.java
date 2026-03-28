package com.RiskAnalyse.project.util;

import java.util.Arrays;
import java.util.List;

public class NewsFilterUtil {

    private static final List<String> CRIME_KEYWORDS = Arrays.asList(
            "crime", "murder", "robbery", "attack",
            "theft", "police", "rape", "violence"
    );

    public static boolean isRelevant(String title) {
        if (title == null || title.isEmpty()) return false;

        String lower = title.toLowerCase();

        // ✅ Only crime filtering (REMOVED location restriction)
        return CRIME_KEYWORDS.stream().anyMatch(lower::contains);
    }
}