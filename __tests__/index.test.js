import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock the child components that fetch data or have complex logic
jest.mock('../src/components/HeroSection', () => () => <div data-testid="hero-section">Hero Section</div>)
jest.mock('../src/components/WhatWeDoSection', () => () => <div>What We Do</div>)
jest.mock('../src/components/FeaturedProjects', () => () => <div>Featured Projects</div>)
jest.mock('../src/components/TechSection', () => () => <div>Tech Section</div>)
jest.mock('../src/components/WhyJoinUs', () => () => <div>Why Join Us</div>)
 
describe('Home Page', () => {
  it('renders all the main sections', async () => {
    // The component is async, so we need to handle the promise
    const HomeResolved = await Home();
    render(HomeResolved);
 
    // Check if the mocked HeroSection is there
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();

    // Check for the other sections by their text content
    expect(screen.getByText('What We Do')).toBeInTheDocument();
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('Tech Section')).toBeInTheDocument();
    expect(screen.getByText('Why Join Us')).toBeInTheDocument();
  })
})