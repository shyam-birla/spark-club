'use client';
import { FaProjectDiagram, FaLightbulb, FaUsers } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: <FaProjectDiagram />,
    title: "Hands-On Projects",
    description: "Hum real-world problems par teams mein kaam karte hain, hackathons aur competitions mein participate karte hain, aur open-source mein contribute karte hain."
  },
  {
    icon: <FaLightbulb />,
    title: "Learning & Skill Development",
    description: "Hum regular hands-on workshops, webinars, aur skill sessions organize karke sabki technical aur soft skills ko behtar banate hain."
  },
  {
    icon: <FaUsers />,
    title: "Career & Networking",
    description: "Hum industry leaders se connect karne ka mauka dete hain aur resume building aur interview prep jaise career-focused sessions organize karte hain."
  }
];

const WhatWeDoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Background ko semi-transparent aur blurred kiya gaya hai
    <section className="bg-white/80 backdrop-blur-sm py-10 md:py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 md:mb-12">What We Do</h2>
        
        {isMobile ? (
          <div className="relative flex items-center justify-center">
            <button 
              onClick={goToPrev} 
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
            >
              &lt;
            </button>
            <div className="w-full max-w-sm mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className={`bg-gray-50 p-4 rounded-lg border border-gray-200 
                              ${index === activeIndex ? 'block' : 'hidden'}`}
                >
                  <div className="text-3xl mb-2 text-black">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-black mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={goToNext} 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
            >
              &gt;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-black transition-colors duration-300">
                <div className="text-4xl mb-4 text-black">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeDoSection;