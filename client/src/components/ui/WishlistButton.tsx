import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface WishlistButtonProps {
  isWishlisted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  isWishlisted,
  onToggle,
  className = '',
  size = 'md',
  ariaLabel
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14 rounded-2xl'
  };

  const iconSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5',
    lg: 'w-7 h-7'
  };

  const handleClick = (e: React.MouseEvent) => {
    onToggle(e);

    // If adding to wishlist, trigger heart confetti burst
    if (!isWishlisted) {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      try {
        const heartShape = confetti.shapeFromPath({
          path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        confetti({
          particleCount: 22,
          spread: 80,
          startVelocity: 18,
          ticks: 60,
          origin: { x: originX, y: originY },
          colors: ['#E03131', '#FF6B6B', '#FF8787', '#FA5252', '#C92A2A', '#E59999'],
          shapes: [heartShape],
          scalar: 1.15,
          disableForReducedMotion: true
        });
      } catch {
        confetti({
          particleCount: 20,
          spread: 70,
          origin: { x: originX, y: originY },
          colors: ['#E03131', '#FF6B6B', '#FA5252']
        });
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.85 }}
      aria-label={ariaLabel || (isWishlisted ? "Remove from wishlist" : "Add to wishlist")}
      className={`relative rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
        isWishlisted
          ? 'bg-surface-container-lowest text-error border-2 border-error/40 shadow-error/15 hover:bg-error/10'
          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'
      } ${sizeClasses[size]} ${className}`}
    >
      <AnimatePresence>
        {isWishlisted && (
          <>
            {/* Bursting Outer Red Ripple Ring */}
            <motion.span
              key="burst-ring"
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-error pointer-events-none"
            />

            {/* Floating Mini Red Heart Pop Up */}
            <motion.div
              key="floating-heart"
              initial={{ opacity: 1, y: 0, scale: 0.7 }}
              animate={{ opacity: 0, y: -28, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute pointer-events-none text-error"
            >
              <Heart className="w-5 h-5 fill-error text-error" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Heart Icon with Elastic Pop & Solid Red Fill */}
      <motion.div
        key={isWishlisted ? 'active-heart' : 'inactive-heart'}
        initial={{ scale: isWishlisted ? 0.3 : 1.2, rotate: isWishlisted ? -30 : 15 }}
        animate={{
          scale: isWishlisted ? [0.3, 1.65, 0.85, 1.2, 1] : [1.2, 0.7, 1],
          rotate: isWishlisted ? [-30, 20, -12, 6, 0] : [15, -10, 0],
        }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="relative z-10 flex items-center justify-center"
      >
        <Heart
          className={`${iconSizes[size]} transition-all duration-200 ${
            isWishlisted
              ? 'fill-error text-error drop-shadow-sm'
              : 'text-on-surface-variant hover:text-error'
          }`}
        />
      </motion.div>
    </motion.button>
  );
};
