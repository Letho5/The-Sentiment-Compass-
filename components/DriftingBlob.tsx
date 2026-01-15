
import React from 'react';
import { motion } from 'framer-motion';

interface DriftingBlobProps {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
}

const DriftingBlob: React.FC<DriftingBlobProps> = ({ color, size, top, left, delay }) => (
  <motion.div
    initial={{ x: 0, y: 0, scale: 1 }}
    animate={{
      x: [0, 60, -60, 30, 0],
      y: [0, -50, 50, -25, 0],
      scale: [1, 1.15, 0.9, 1.1, 1]
    }}
    transition={{
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className="absolute rounded-full blur-[100px] lg:blur-[120px] pointer-events-none opacity-20 lg:opacity-30"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
      zIndex: 0
    }}
  />
);

export default DriftingBlob;
