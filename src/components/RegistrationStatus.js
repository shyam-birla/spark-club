'use client';

import { useState } from 'react';
import Link from 'next/link';
import EventRegistrationWrapper from '@/components/EventRegistrationWrapper';
import { useRouter } from 'next/navigation'; // 1. useRouter ko import karein

export default function RegistrationStatus({ event, isAlreadyRegistered }) {
    const [justRegistered, setJustRegistered] = useState(false);
    const router = useRouter(); // 2. router ko initialize karein

    const handleSuccess = () => {
        // 3. UI ko turant update karein
        setJustRegistered(true); 
        // 4. Server se naya data laane ke liye cache ko refresh karein
        router.refresh(); 
    };

    // Agar user pehle se registered hai (server se pata chala) ya abhi-abhi hua hai (client state se)
    if (isAlreadyRegistered || justRegistered) {
        return (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
                <p className="font-semibold">✅ You are successfully registered for this event!</p>
            </div>
        );
    }
    
    // Agar external link hai aur registration open hai
    if (event.registrationLink && event.registrationStatus === 'open') {
        return (
            <div className="flex justify-center">
                <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    <button className="bg-black text-white px-4 py-2 rounded-md font-semibold text-base md:px-6 md:py-3 md:text-lg hover:opacity-80 transition-opacity">
                        Register Now
                    </button>
                </Link>
            </div>
        );
    }

    // Agar internal form hai aur registration open hai
    if (!event.registrationLink && event.registrationStatus === 'open') {
        return (
            <EventRegistrationWrapper 
                customRegistrationFields={event.customRegistrationFields} 
                eventId={event._id} 
                onRegistrationSuccess={handleSuccess}
            />
        );
    }

    // Agar registration jald hi shuru honge
    if (event.registrationStatus === 'comingSoon') {
        return (
            <div className="text-center p-4 bg-blue-100 text-blue-800 rounded-md">
                <p className="font-semibold">Registrations will open soon. Stay tuned!</p>
            </div>
        );
    }

    // Baaki sabhi cases mein (e.g., closed)
    return (
        <div className="text-center p-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-semibold">Registrations are now closed.</p>
        </div>
    );
};