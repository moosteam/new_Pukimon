import React from 'react';

interface PlayerCardProps {
  imageSrc: string;
  rotate: number;
  position: number;
  translateY: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ imageSrc, rotate, position, translateY }) => {
  return (
    <div className="w-full flex justify-center z-50">
      <div
        className="absolute border-2 border-amber-100 w-48 h-70 flex justify-center transition-all duration-2000 overflow-hidden pointer-events-none z-50"
        style={{
          transform: `perspective(800px) rotateY(${rotate}deg) scale(1) translateX(${position}rem) translateY(${translateY}rem)`
        }}
      >
        <img src={imageSrc} alt="player card" className="w-72 h-72 object-cover" />
      </div>
    </div>
  );
};
