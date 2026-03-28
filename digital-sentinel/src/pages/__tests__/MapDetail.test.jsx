import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PATHS } from '../../constants/journey';
import MapDetail from '../MapDetail';

const tripState = {
  destination: 'London, UK',
  profile: 'solo',
  time: 12,
  mode: 'walking'
};

test('renders MapDetail header when trip state exists', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: PATHS.map, state: tripState }]}>
      <MapDetail />
    </MemoryRouter>
  );
  expect(screen.getByText(/Live safety map/i)).toBeInTheDocument();
});

test('map without safety-check state prompts to open Safety check', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: PATHS.map }]}>
      <MapDetail />
    </MemoryRouter>
  );
  expect(screen.getByText(/Choose a place first/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Open Safety check/i })).toHaveAttribute('href', PATHS.assess);
});
