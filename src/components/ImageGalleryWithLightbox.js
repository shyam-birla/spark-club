'use client';

'use client';
import { useState } from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from '../../sanity/lib/client';
import Carousel from './Carousel';
import { FaCamera } from 'react-icons/fa';

export default function ImageGalleryWithLightbox({ gallery }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!gallery || gallery.length === 0) {
        return null;
    }

    const slides = gallery.map(image => ({
        src: urlFor(image).url()
    }));

    return (
        <>
            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-3"><FaCamera /> Photos</h2>
                <Carousel itemsPerPage={1}>
                    {gallery.map((image, i) => (
                        <div key={i} className="relative w-full h-20 md:h-32 cursor-pointer" onClick={() => { setIndex(i); setOpen(true); }}>
                            <Image src={urlFor(image).url()} alt={`Event photo ${i + 1}`} fill className="rounded-lg object-contain" />
                        </div>
                    ))}
                </Carousel>
            </section>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </>
    );
}
