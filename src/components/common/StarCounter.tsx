import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface StarCounterProps {
  stars: number;
}

export const StarCounter: React.FC<StarCounterProps> = ({ stars }) => {
  return (
    <motion.div
      key={stars}
      initial={{ scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className="flex items-center gap-1.5 rounded-2xl bg-amber-50 border-2 border-amber-300 px-3 py-1.5 text-amber-900 font-display font-bold shadow-[0_3px_0_#FCD34D] whitespace-nowrap shrink-0"
      aria-label={`সংগৃহীত তারা: ${stars}টি`}
    >
      <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
      <span className="tabular-nums text-sm">{stars}</span>
    </motion.div>
  );
};
