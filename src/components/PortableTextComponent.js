'use client'; // This component uses client-side hooks

import { PortableText } from '@portabletext/react';

const PortableTextComponent = ({ value }) => {
  // Add custom components for styling if needed in the future
  const components = {};

  return <PortableText value={value} components={components} />;
};

export default PortableTextComponent;