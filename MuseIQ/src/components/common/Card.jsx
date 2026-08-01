import React from 'react';
import clsx from 'clsx';

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-bg-secondary rounded-xl border border-border shadow-soft overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
