// This file simulates backend Spring Boot API calls
// Replace these with actual fetch/axios calls to your Spring Boot REST controllers

export const analyzeSafety = async (destination, profile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', tracking_id: 'TRK-' + Math.random().toString(36).substr(2, 9) });
      }, 1500);
    });
  };
  
  export const fetchDashboardData = async (location) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          safetyScore: 78,
          location: location || "Le Marais, Paris",
          intelligenceBrief: `"This area is generally safe for solo travelers during the day, but we recommend avoiding the south-east park area after 9 PM due to low lighting and reported incidents. Local transit remains high-frequency and well-monitored through 11 PM."`,
          // Mock data structure
        });
      }, 800);
    });
  };
  
  export const triggerEmergencyAlert = async (type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' });
      }, 1000);
    });
  };