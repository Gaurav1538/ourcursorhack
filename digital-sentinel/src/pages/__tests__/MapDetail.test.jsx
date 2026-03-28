import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MapDetail from '../MapDetail';

test('renders MapDetail header', () => {
  render(
    <MemoryRouter>
      <MapDetail />
    </MemoryRouter>
  );
  expect(screen.getByText(/Route Intelligence/i)).toBeInTheDocument();
});
