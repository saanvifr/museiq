import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-border', className)}
      {...props}
    />
  );
};
