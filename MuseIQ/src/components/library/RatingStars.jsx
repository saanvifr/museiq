import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

export const RatingStars = ({ rating, onChange, readOnly = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(star)}
          className={clsx(
            "focus:outline-none transition-transform duration-150",
            !readOnly && "hover:scale-110"
          )}
        >
          <Star
            className={clsx(
              "h-5 w-5",
              star <= rating 
                ? "text-primary fill-primary" 
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
};
