import { FaCogs, FaLightbulb, FaUsers } from 'react-icons/fa';

const reasons = [
  {
    icon: <FaCogs />,
    title: "Build Real-World Projects",
    description: "Move beyond theory. Build real-world applications, contribute to open-source, and showcase your skills in a collaborative environment."
  },
  {
    icon: <FaLightbulb />,
    title: "Learning & Skill Development",
    description: "Attend exclusive workshops on cutting-edge technologies, get mentored by seniors, and accelerate your learning curve exponentially."
  },
  {
    icon: <FaUsers />,
    title: "Career & Networking",
    description: "Connect with industry professionals, get access to internship opportunities, and prepare for your dream job with our career-focused sessions."
  }
];

const WhyJoinUs = () => {
  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-12">Why Join SPARK!?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-orange-500">{reason.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-gray-700 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;
