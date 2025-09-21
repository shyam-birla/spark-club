const AboutContent = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-black">Our Story</h1>
        {/* Subtitle with improved contrast */}
        <p className="text-lg text-gray-700 mt-4">
          The driving force behind SPARK! - a group of passionate innovators and thinkers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="w-full h-80 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-gray-500">SPARK! Team Photo</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-black mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            To foster a vibrant community of innovators and problem-solvers. We aim to bridge the gap between theoretical knowledge and real-world application by providing a platform for collaborative learning, hands-on project development, and continuous skill enhancement.
          </p>
          <h2 className="text-3xl font-bold text-black mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To become the leading student-run technology hub in our institution, recognized for producing high-impact projects and nurturing future-ready tech leaders. We envision a culture where every member is empowered to create, innovate, and make a tangible difference in the world through technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;

