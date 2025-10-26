'use client';

import Link from 'next/link';
import { FaPlusCircle } from 'react-icons/fa';

export default function CallToAction({ title, description, buttonText, buttonLink }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center my-12">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-lg mb-6">{description}</p>
      <Link href={buttonLink}>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mx-auto">
          <FaPlusCircle />
          {buttonText}
        </button>
      </Link>
    </div>
  );
}
