import Image from 'next/image';
import { FaUserTie } from 'react-icons/fa';

export default function HostedBy({ hosts }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaUserTie /> Hosted By</h3>
      <div className="flex flex-wrap gap-4">
        {hosts && hosts.length > 0 ? (
          hosts.map((host, index) => (
            <div key={index} className="group relative">
              <Image
                src={host.logoUrl}
                alt={host.name}
                width={80}
                height={80}
                className="object-contain"
              />
              <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {host.name}
              </div>
            </div>
          ))
        ) : (
          <p>SPARK Community</p>
        )}
      </div>
    </div>
  );
}
