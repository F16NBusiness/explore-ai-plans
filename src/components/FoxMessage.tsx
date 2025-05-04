
import React from 'react';
import FoxMascot from './FoxMascot';

interface FoxMessageProps {
  message: string;
  variant?: 'ski' | 'beach' | 'map' | 'family' | 'default';
  position?: 'left' | 'right';
  className?: string;
}

const FoxMessage: React.FC<FoxMessageProps> = ({ 
  message, 
  variant = 'default',
  position = 'left',
  className = '' 
}) => {
  return (
    <div className={`flex items-end gap-3 ${position === 'right' ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      <FoxMascot variant={variant} size="sm" />
      
      <div className={`
        relative max-w-[75%] p-3 rounded-2xl mb-1
        ${position === 'left' 
          ? 'bg-gradient-to-br from-amber-50 to-orange-100 text-orange-800 rounded-bl-none' 
          : 'bg-gradient-to-br from-purple-50 to-blue-100 text-purple-800 rounded-br-none'}
      `}>
        <p className="text-sm">{message}</p>
        <div 
          className={`absolute bottom-0 ${position === 'left' ? '-left-2' : '-right-2'} w-4 h-4 
          ${position === 'left' 
            ? 'bg-orange-100' 
            : 'bg-blue-100'}
          `}
          style={{
            clipPath: position === 'left' 
              ? 'polygon(0 0, 100% 100%, 100% 0)' 
              : 'polygon(0 0, 0 100%, 100% 0)'
          }}
        />
      </div>
    </div>
  );
};

export default FoxMessage;
