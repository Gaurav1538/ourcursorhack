package com.RiskAnalyse.project.data;

import com.RiskAnalyse.project.model.Area;
import com.RiskAnalyse.project.model.embedded.CrimeData;
import com.RiskAnalyse.project.model.embedded.Location;
import com.RiskAnalyse.project.repository.AreaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AreaRepository areaRepository;

    @Override
    public void run(String... args) {

        if (areaRepository.count() > 0) return;

        // Delhi - Connaught Place
        Area delhi = new Area();
        delhi.setCity("Delhi");
        delhi.setAreaName("Connaught Place");
        delhi.setAreaRisk(0.7);
        delhi.setEmergencyScore(0.9);

        Location loc1 = new Location();
        loc1.setLat(28.6315);
        loc1.setLng(77.2167);

        CrimeData crime1 = new CrimeData();
        crime1.setTheft(40);
        crime1.setHarassment(25);
        crime1.setTraffic(15);

        delhi.setLocation(loc1);
        delhi.setCrimeData(crime1);

        // Mumbai - Bandra
        Area mumbai = new Area();
        mumbai.setCity("Mumbai");
        mumbai.setAreaName("Bandra");
        mumbai.setAreaRisk(0.3);
        mumbai.setEmergencyScore(0.9);

        Location loc2 = new Location();
        loc2.setLat(19.0596);
        loc2.setLng(72.8295);

        CrimeData crime2 = new CrimeData();
        crime2.setTheft(15);
        crime2.setHarassment(8);
        crime2.setTraffic(10);

        mumbai.setLocation(loc2);
        mumbai.setCrimeData(crime2);

        areaRepository.save(delhi);
        areaRepository.save(mumbai);

        System.out.println("✅ Dummy data loaded");
    }
}