'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ children, itemsPerPage = 1, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!children || children.length === 0) {
    return null;
  }

  const totalItems = React.Children.count(children);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
  };

  const visibleChildren = isMobile
    ? React.Children.toArray(children).slice(activeIndex, activeIndex + itemsPerPage)
    : children; // On desktop, show all items

  return (
    <div className={`relative ${className}`}>
      {totalItems > itemsPerPage && (
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        >
          <FaChevronLeft />
        </button>
      )}
      <div className="flex justify-center items-center gap-4">
        {React.Children.toArray(children).slice(activeIndex, activeIndex + itemsPerPage)}
      </div>
      {totalItems > itemsPerPage && (
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default Carousel;
