'use client';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const HeroSection = () => {
  return (
    // Background ko transparent kiya taaki peeche ka 3D object dikhe
    <section className="relative flex flex-col items-center justify-center text-center py-12 px-4 min-h-[50vh] md:py-24 md:min-h-[70vh]">
        <TypeAnimation
          sequence={[
            'Innovating at the Intersection of Code and Discovery',
            2000,
          ]}
          wrapper="h1"
          speed={50}
          className="text-4xl md:text-6xl font-bold text-black"
          repeat={Infinity}
        />
        <p className="mt-4 text-sm text-gray-600 max-w-2xl md:mt-6 md:text-lg">
          A student-led hub for AI/ML research and collaborative development.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:gap-4">
          <Link href="/projects">
            <button className="bg-black text-white px-4 py-2 rounded-md font-semibold text-sm hover:opacity-80 transition-opacity transform hover:scale-105 md:px-8 md:py-3 md:text-lg">
              Explore Our Projects
            </button>
          </Link>
          <Link href="/events">
            <button className="border-2 border-black text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-black hover:text-white transition-all transform hover:scale-105 md:px-8 md:py-3 md:text-lg">
              View Events
            </button>
          </Link>
        </div>
    </section>
  );
};

export default HeroSection;