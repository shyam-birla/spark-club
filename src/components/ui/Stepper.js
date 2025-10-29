
'use client';

import { FaCheckCircle } from 'react-icons/fa';

const Stepper = ({ steps, activeSection, completedSections }) => {
  const activeIndex = steps.findIndex(step => step.id === activeSection);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <div className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4
              ${index < activeIndex ? 'border-sky-600' : index === activeIndex ? 'border-sky-600' : 'border-gray-200'}
            `}>
              <span className={`text-sm font-medium transition-colors flex items-center justify-between
                ${index < activeIndex ? 'text-sky-600' : index === activeIndex ? 'text-sky-600' : 'text-gray-500'}
              `}>
                <span>{step.name}</span>
                {completedSections[step.id] && <FaCheckCircle className="text-green-500 ml-2" />}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
