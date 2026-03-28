package com.RiskAnalyse.project.service;

import org.springframework.stereotype.Service;

@Service
public class AlertService {

    public void checkAndAlert(double risk, double lat, double lng) {

        if (risk > 80) {
            System.out.println("🚨 ALERT: High risk at " + lat + ", " + lng);
        }
    }
}