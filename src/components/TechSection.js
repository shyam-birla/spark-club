import Image from 'next/image';

const technologies = [
  { name: 'Python', src: '/tech-logos/python.svg' },
  { name: 'React', src: '/tech-logos/react.svg' },
  { name: 'Next.js', src: '/tech-logos/nextjs.svg' },
  { name: 'TensorFlow', src: '/tech-logos/tensorflow.svg' },
  { name: 'Docker', src: '/tech-logos/docker.svg' },
  { name: 'Git', src: '/tech-logos/git.svg' },
  { name: 'Java', src: '/tech-logos/java.svg' },
];

const TechSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Subtitle with improved contrast */}
        <h2 className="text-sm font-bold uppercase text-gray-600 tracking-widest">
          Technologies We Work With
        </h2>
        <div className="flex flex-wrap justify-center items-center mt-8 gap-10 md:gap-14">
          {technologies.map((tech) => (
            <div key={tech.name} className="grayscale hover:grayscale-0 transition-all duration-300" title={tech.name}>
              <Image src={tech.src} alt={tech.name} width={60} height={60} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;