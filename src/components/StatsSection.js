// src/components/StatsSection.js
'use client';
import { FaUsers, FaProjectDiagram, FaCalendarAlt } from 'react-icons/fa';

const StatsSection = ({ stats }) => {
  if (!stats) return null;

  const statsItems = [
    { icon: <FaUsers />, value: stats.membersCount || 0, label: 'Active Members' },
    { icon: <FaProjectDiagram />, value: stats.projectsCount || 0, label: 'Projects Completed' },
    { icon: <FaCalendarAlt />, value: stats.eventsCount || 0, label: 'Events Hosted' },
  ];

  return (
    <section className="bg-gray-50/50 backdrop-blur-sm pt-20 pb-10 text-black">
      <div className="container mx-auto px-4 text-center">
        {/* === YAHAN HEADING ADD KI GAYI HAI === */}
        <h2 className="text-3xl font-bold text-black mb-12"> - Community Stats - </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl text-orange-400 mb-2">{item.icon}</div>
              <p className="text-5xl font-bold">{item.value}+</p>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;