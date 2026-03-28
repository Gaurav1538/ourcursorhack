package com.RiskAnalyse.project.repository;

import com.RiskAnalyse.project.model.Area;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AreaRepository extends MongoRepository<Area, String> {

    Optional<Area> findByCityAndAreaName(String city, String areaName);
}
