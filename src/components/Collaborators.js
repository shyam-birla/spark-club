import Image from 'next/image';
import { FaHandshake } from 'react-icons/fa';
import Carousel from './Carousel';

export default function Collaborators({ collaborators, className = '' }) {

  if (!collaborators || collaborators.length === 0) {

    return null;

  }



  return (

    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}>

      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaHandshake /> PARTNERS</h3>

      <Carousel itemsPerPage={1}>
        {collaborators.map((collaborator, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={collaborator.logoUrl}
              alt={collaborator.name}
              width={40}
              height={40}
              className="object-contain mb-2"
            />
            <p className="text-sm text-center font-semibold text-gray-700">{collaborator.name}</p>
          </div>
        ))}
      </Carousel>

    </div>

  );

}