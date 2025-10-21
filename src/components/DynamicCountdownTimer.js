'use client';

import dynamic from 'next/dynamic';

const CountdownTimer = dynamic(() => import('./Countdown'), {
  loading: () => <div className="h-12 w-full animate-pulse bg-gray-200 rounded-md"></div>,
  ssr: false
});

const DynamicCountdownTimer = ({ date }) => {
  return <CountdownTimer date={date} />;
};

export default DynamicCountdownTimer;
