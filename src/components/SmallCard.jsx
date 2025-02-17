import React from "react";

const SmallCard = ({ 
  title,
  splitFrom,
  splitTo,
  color,
  className = "",
  textCenter = false,
  padding = 'p-3',
  onClick
}) => {
  const gradientClasses = splitFrom && splitTo 
    ? `bg-[linear-gradient(135deg,var(--tw-gradient-from)_50%,var(--tw-gradient-to)_50%)] ${splitFrom} ${splitTo}`
    : `bg-gradient-to-r ${color}`;

  return (
    <div
      onClick={onClick}
      className={`group relative ${padding} rounded-xl shadow-lg hover:shadow-xl cursor-pointer
        ${gradientClasses}
        transition-all duration-300 
        transform hover:-translate-y-1.5 
        overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
      
      <div className="relative">
        <h2 className={`text-base ${textCenter ? 'text-center' : ''} font-bold text-white drop-shadow-md`}>
          {title}
        </h2>
        
        <div className="absolute -top-6 -right-6 w-14 h-14 rounded-full bg-white/10 transform rotate-45" />
        <div className="absolute -bottom-6 -left-6 w-14 h-14 rounded-full bg-white/10 transform rotate-45" />
      </div>
    </div>
  );
};

export default SmallCard;