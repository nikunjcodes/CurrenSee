import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const classes = clsx(
    'bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-200 dark:border-secondary-700 transition-all duration-300',
    paddingClasses[padding],
    hover && 'hover:shadow-elevated hover:-translate-y-1',
    className
  );
  
  const MotionCard = hover ? motion.div : 'div';
  
  return (
    <MotionCard
      className={classes}
      {...(hover && {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        initial: { y: 0 },
      })}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

export default Card;
