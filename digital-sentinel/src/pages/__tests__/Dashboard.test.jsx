import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../services/api', () => ({
  analyzeSafety: vi.fn(() => Promise.resolve({ score: 90, riskLevel: 'Low', insights: ['Test insight'], recommendations: ['Stay alert'], breakdown: { lighting: 90 } })),
  getTrends: vi.fn(() => Promise.resolve({ overallTrend: 'Improving', weeklyIncidents: [1,2,3] })),
  chatAssistant: vi.fn(() => Promise.resolve({ reply: 'Assistant reply' }))
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
