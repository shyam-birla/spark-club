'use client';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const HeroSection = () => {
  return (
    // Background ko transparent kiya taaki peeche ka 3D object dikhe
    <section className="relative flex flex-col items-center justify-center text-center py-24 px-4 min-h-[70vh]">
        <TypeAnimation
          sequence={[
            'Innovating at the Intersection of Code and Discovery',
            2000,
          ]}
          wrapper="h1"
          speed={50}
          className="text-5xl md:text-6xl font-bold text-black"
          repeat={Infinity}
        />
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          A student-led hub for AI/ML research and collaborative development.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/projects">
            <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity transform hover:scale-105">
              Explore Our Projects
            </button>
          </Link>
          <Link href="/events">
            <button className="border-2 border-black text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-black hover:text-white transition-all transform hover:scale-105">
              View Events
            </button>
          </Link>
        </div>
    </section>
  );
};

export default HeroSection;