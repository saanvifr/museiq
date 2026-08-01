import React from 'react';
import { Button } from './Button';
import clsx from 'clsx';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-12 text-center bg-bg-secondary rounded-xl border border-border border-dashed", className)}>
      {Icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bg-primary mb-6 text-gray-500">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
