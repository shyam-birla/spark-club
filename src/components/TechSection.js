import Image from 'next/image';

const TechSection = ({ technologies = [] }) => {
  return (
    <section className="bg-white/50 backdrop-blur-sm py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-sm font-bold uppercase text-gray-600 tracking-widest">
          Technologies We Work With
        </h2>
        <div className="flex justify-around items-center mt-8 gap-2 md:gap-14">
          
          {/* === YAHAN FINAL FIX KIYA GAYA HAI === */}
          {/* Hum check kar rahe hain ki 'technologies' ek array hai ya nahi */}
          {Array.isArray(technologies) && technologies.map((tech) => (
            <div key={tech._id} className="grayscale hover:grayscale-0 transition-all duration-300 w-8 h-8 md:w-[60px] md:h-[60px] flex items-center justify-center" title={tech.name}>
              <Image src={tech.logoUrl} alt={tech.name} width={60} height={60} className="object-contain" />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};
export default TechSection;