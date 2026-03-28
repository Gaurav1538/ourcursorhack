import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../services/api', () => ({
  extractCityKey: vi.fn(() => 'London'),
  analyzeSafety: vi.fn(() => Promise.resolve({ score: 90, riskLevel: 'Low', insights: ['Test insight'], recommendations: ['Stay alert'], breakdown: { lighting: 90 } })),
  getTrends: vi.fn(() => Promise.resolve({ overallTrend: 'Improving', weeklyIncidents: [1, 2, 3, 2, 1, 4, 2] })),
  chatAssistant: vi.fn(() => Promise.resolve({ reply: 'Assistant reply' })),
  getCrimeNews: vi.fn(() => Promise.resolve([])),
  getWeatherByCity: vi.fn(() => Promise.resolve([])),
  askAiQuestion: vi.fn(() => Promise.resolve('AI brief for tests.'))
}));

import Dashboard from '../Dashboard';

test('renders Dashboard and shows safety score', async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText(/Live Safety Index/i)).toBeInTheDocument());
  expect(screen.getByText(/90/)).toBeInTheDocument();
});
