
import React from 'react';

// Import the fox mascot images as static assets
import foxDefault from '../assets/fox-logo.webp';
import foxSki from '../assets/fox-logo2.webp';
import foxBeach from '../assets/fox-logo3.webp';
import foxMap from '../assets/fox-logo4.webp';

type FoxMascotVariant = 'default' | 'ski' | 'beach' | 'map' | 'family';
type FoxMascotSize = 'sm' | 'md' | 'lg';

interface FoxMascotProps {
  variant?: FoxMascotVariant;
  size?: FoxMascotSize;
  className?: string;
}

const FoxMascot: React.FC<FoxMascotProps> = ({ 
  variant = 'default', 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const getImageSrc = () => {
    switch (variant) {
      case 'ski':
        return foxSki;
      case 'beach':
        return foxBeach;
      case 'map':
        return foxMap;
      case 'default':
      default:
        return foxDefault;
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative group animate-fadeIn`}>
      <img 
        src={getImageSrc()} 
        alt={`Fox mascot ${variant}`} 
        className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300"
      />
    </div>
  );
};

export default FoxMascot;
