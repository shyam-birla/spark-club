'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfileChecker({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProfileChecked, setIsProfileChecked] = useState(false);

  useEffect(() => {
    console.log('ProfileChecker: status is', status);
  }, [status]);

  return <>{children}</>;
}
