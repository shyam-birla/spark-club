import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

jest.mock('../src/components/AnimatedSection', () => {
  const MockAnimatedSection = ({ children }) => <div>{children}</div>;
  MockAnimatedSection.displayName = 'MockAnimatedSection';
  return MockAnimatedSection;
});
jest.mock('../src/components/HeroSection', () => {
  const MockHeroSection = () => <div data-testid="hero-section">Hero Section</div>;
  MockHeroSection.displayName = 'MockHeroSection';
  return MockHeroSection;
});
jest.mock('../src/components/WhatWeDoSection', () => {
    const MockWhatWeDoSection = () => <div>What We Do</div>;
    MockWhatWeDoSection.displayName = 'MockWhatWeDoSection';
    return MockWhatWeDoSection;
});
jest.mock('../src/components/FeaturedProjects', () => {
    const MockFeaturedProjects = () => <div>Featured Projects</div>;
    MockFeaturedProjects.displayName = 'MockFeaturedProjects';
    return MockFeaturedProjects;
});
jest.mock('../src/components/TechSection', () => {
    const MockTechSection = () => <div>Tech Section</div>;
    MockTechSection.displayName = 'MockTechSection';
    return MockTechSection;
});
jest.mock('../src/components/FeaturedEvents', () => {
    const MockFeaturedEvents = () => <div>Featured Events</div>;
    MockFeaturedEvents.displayName = 'MockFeaturedEvents';
    return MockFeaturedEvents;
});
jest.mock('../src/components/FeaturedResources', () => {
    const MockFeaturedResources = () => <div>Featured Resources</div>;
    MockFeaturedResources.displayName = 'MockFeaturedResources';
    return MockFeaturedResources;
});
jest.mock('../src/components/Testimonials', () => {
    const MockTestimonials = () => <div>Testimonials</div>;
    MockTestimonials.displayName = 'MockTestimonials';
    return MockTestimonials;
});
jest.mock('../src/components/StatsSection', () => {
    const MockStatsSection = () => <div>Stats Section</div>;
    MockStatsSection.displayName = 'MockStatsSection';
    return MockStatsSection;
});
jest.mock('../src/components/Footer', () => {
    const MockFooter = () => <div>Footer</div>;
    MockFooter.displayName = 'MockFooter';
    return MockFooter;
});
 
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
    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.getByText('Featured Resources')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Stats Section')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  })
})