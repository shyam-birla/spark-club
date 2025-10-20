'use client';

import { useState, useEffect } from 'react';
import Countdown from 'react-countdown';

const CountdownTimer = ({ date }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return null;
    } else {
      return (
        <div className="flex items-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{days}</p>
            <p className="text-sm">Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{hours}</p>
            <p className="text-sm">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{minutes}</p>
            <p className="text-sm">Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{seconds}</p>
            <p className="text-sm">Seconds</p>
          </div>
        </div>
      );
    }
  };

  return <>{isClient && <Countdown date={date} renderer={renderer} />}</>;
};

export default CountdownTimer;