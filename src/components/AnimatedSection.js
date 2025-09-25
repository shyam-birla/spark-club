'use client';

import { motion } from 'framer-motion';

const AnimatedSection = ({ children }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} // Shuruaat mein section invisible aur thoda neeche hoga
      whileInView={{ opacity: 1, y: 0 }} // Jab view mein aayega, toh visible aur apni jagah par aa jayega
      transition={{ duration: 0.6, ease: "easeInOut" }} // Animation ki speed aur style
      viewport={{ once: true }} // Animation sirf ek baar chalega
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;