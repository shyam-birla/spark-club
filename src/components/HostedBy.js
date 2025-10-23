import Image from 'next/image';
import { FaUserTie } from 'react-icons/fa';
import Carousel from './Carousel';

export default function HostedBy({ hosts, className = '' }) {

  return (

    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}>

      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaUserTie /> HOSTS</h3>

      {hosts && hosts.length > 0 ? (

                                <Carousel itemsPerPage={1} buttonSizeClass="p-0.5 text-xs">

                                  {hosts.map((host, index) => (

                                    <div key={index} className="flex flex-col items-center">

                                                                                <Image

                                                                                  src={host.logoUrl}

                                                                                  alt={host.name}

                                                                                  width={60}

                                                                                  height={60}

                                                                                  className="rounded-full object-contain mb-2"

                                                                                />

                                      <p className="text-xs text-center font-semibold text-gray-700">{host.name}</p>

                                    </div>

                                  ))}

                                </Carousel>

      ) : (

        <p>SPARK Community</p>

      )}

    </div>

  );

}
