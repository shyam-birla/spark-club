const WhyJoinUs = () => {
  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-12">Why Join SPARK!?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚙️</div>
            {/* Description with improved contrast */}
            <p className="text-gray-700">
              Move beyond theory. Build real-world applications, contribute to open-source, and showcase your skills in a collaborative environment.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-2">Learning & Skill Development</h3>
            <p className="text-gray-600">
              Attend exclusive workshops on cutting-edge technologies, get mentored by seniors, and accelerate your learning curve exponentially.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Career & Networking</h3>
            <p className="text-gray-600">
              Connect with industry professionals, get access to internship opportunities, and prepare for your dream job with our career-focused sessions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;
