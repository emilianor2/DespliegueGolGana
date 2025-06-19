import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home page', () => {
  it('renders welcome text', () => {
    render(<Home />);
    expect(screen.getByText(/Bienvenido a Golgana/i)).toBeInTheDocument();
  });
});
