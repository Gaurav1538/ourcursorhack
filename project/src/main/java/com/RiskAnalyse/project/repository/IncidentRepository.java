package com.RiskAnalyse.project.repository;

import com.RiskAnalyse.project.model.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IncidentRepository extends MongoRepository<Incident, String> {

    // ✅ EXISTING (keep if already added)
    @Query("""
    {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [?0, ?1]
          },
          $maxDistance: ?2
        }
      }
    }
    """)
    List<Incident> findNearby(double lng, double lat, double maxDistance);

    // 🔥 NEW (used in risk engine)
    @Query("""
    {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [?0, ?1]
          },
          $maxDistance: ?2
        }
      }
    }
    """)
    List<Incident> findNearbyLimited(double lng, double lat, double maxDistance);
}