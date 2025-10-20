import Image from 'next/image';
import { FaHandshake } from 'react-icons/fa';

export default function Collaborators({ collaborators }) {
  if (!collaborators || collaborators.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaHandshake /> In Collaboration With</h3>
      <div className="flex flex-wrap gap-4">
        {collaborators.map((collaborator, index) => (
          <div key={index} className="group relative">
            <Image
              src={collaborator.logoUrl}
              alt={collaborator.name}
              width={80}
              height={80}
              className="object-contain"
            />
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {collaborator.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}