import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../../utils/weather", () => ({
  fetchOpenMeteoCurrent: vi.fn(() =>
    Promise.resolve({ temperature: 14, windspeed: 3, weathercode: 2 }),
  ),
}));

vi.mock("../../api", () => ({
  geocodeAddress: vi.fn(() => Promise.resolve({ lat: 51.5, lng: -0.12 })),
  analyzeSafety: vi.fn(() =>
    Promise.resolve({
      score: 90,
      riskLevel: "Low",
      insights: ["Test insight"],
      recommendations: ["Stay alert"],
      breakdown: { lighting: 90 },
    }),
  ),
  getTrends: vi.fn(() =>
    Promise.resolve({ overallTrend: "Improving", weeklyIncidents: [1, 2, 3] }),
  ),
  chatAssistant: vi.fn(() => Promise.resolve({ reply: "Assistant reply" })),
  getRiskScore: vi.fn(() => Promise.resolve({ score: 72 })),
  getRiskDetailed: vi.fn(() =>
    Promise.resolve({ score: 72, riskLevel: "Low", factors: ["Test factor"] }),
  ),
  getNearbyIncidents: vi.fn(() => Promise.resolve([])),
  getLocationHeatmap: vi.fn(() => Promise.resolve([])),
  askAi: vi.fn(() => Promise.resolve({ answer: "AI snapshot text." })),
}));

import Dashboard from "../Dashboard";

test("renders Dashboard and shows safety score", async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );

  await waitFor(() =>
    expect(screen.getByText(/Live safety index/i)).toBeInTheDocument(),
  );
  expect(screen.getAllByText("90").length).toBeGreaterThanOrEqual(1);
});
