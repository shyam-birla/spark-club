// src/components/Testimonials.js
import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';
import Marquee from "react-fast-marquee"; // Nayi library import ki

const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    // 1. Background ko semi-transparent grey kiya gaya hai
    <section className="py-20 bg-gray-50/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-12">What Our Members Say</h2>
        
        {/* 2. Grid ki jagah Marquee component ka istemal kiya gaya hai */}
        <Marquee 
          pauseOnHover={true} 
          speed={40}
          gradient={false}
        >
          {testimonials.map((testimonial) => (
            // Har card ko marquee ke andar daala gaya hai
            // Thoda sa margin add kiya hai taaki cards chipke nahi
            <div key={testimonial._id} className="bg-gray-50/70 p-8 rounded-lg shadow-md flex flex-col items-center text-center mx-4 w-96">
              <FaQuoteLeft className="text-orange-400 text-4xl mb-4" />
              <p className="text-gray-600 italic mb-6 flex-grow h-32">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center mt-4">
                {testimonial.authorImageUrl && (
                  <Image
                    src={testimonial.authorImageUrl}
                    alt={testimonial.authorName}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-bold text-black">{testimonial.authorName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;