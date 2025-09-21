import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-black flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-5xl md:text-6xl font-bold text-white">
        Innovating at the Intersection of Code and Discovery
      </h1>
      {/* Subheading with improved contrast */}
      <p className="mt-6 text-lg text-gray-200 max-w-2xl">
        A student-led hub for AI/ML research and collaborative development.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/projects">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors">
            Explore Our Projects
          </button>
        </Link>
        <Link href="/about">
          <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white hover:text-black transition-colors">
            About Our Club
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;