import { FaProjectDiagram, FaLightbulb, FaUsers } from 'react-icons/fa';

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
  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    // Background ko semi-transparent aur blurred kiya gaya hai
    <section className="bg-white/50 backdrop-blur-sm py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-black transition-colors duration-300">
              <div className="text-4xl mb-4 text-black">{feature.icon}</div>
              <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;