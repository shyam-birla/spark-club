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
    <section className="bg-gray-50 py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-orange-500">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              {/* Feature description with improved contrast */}
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;