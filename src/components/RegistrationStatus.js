'use client';

import { useState } from 'react';
import Link from 'next/link';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import Modal from './Modal'; // Naya Modal component import kiya

export default function RegistrationStatus({ event, isAlreadyRegistered }) {
    const [justRegistered, setJustRegistered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal ke liye nayi state

    const handleSuccess = () => {
        setJustRegistered(true);
        setIsModalOpen(false); // Success par modal band kar dein
    };

    if (isAlreadyRegistered || justRegistered) {
        return (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
                <p className="font-semibold">✅ You are successfully registered for this event!</p>
            </div>
        );
    }
    
    if (event.registrationLink && event.registrationStatus === 'open') {
        return (
            <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                <button className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity">
                    Register Here (External Link)
                </button>
            </Link>
        );
    }

    if (!event.registrationLink && event.registrationStatus === 'open') {
        return (
            <>
                {/* Ab yeh sirf ek button hai jo modal open karta hai */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:opacity-80 transition-opacity"
                >
                    Register Now
                </button>

                {/* Modal component jo form ko dikhayega */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <EventRegistrationForm 
                        eventTitle={event.title} 
                        eventId={event._id} 
                        onRegistrationSuccess={handleSuccess} 
                    />
                </Modal>
            </>
        );
    }

    if (event.registrationStatus === 'comingSoon') {
        return (
            <div className="text-center p-4 bg-blue-100 text-blue-800 rounded-md">
                <p className="font-semibold">Registrations will open soon. Stay tuned!</p>
            </div>
        );
    }

    return (
        <div className="text-center p-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-semibold">Registrations are now closed.</p>
        </div>
    );
};