import React from 'react';
import { evolutionStyles } from '../../styles/evolution';

interface EvolutionIndicatorProps {
  size?: 'small' | 'large';
}

export const EvolutionIndicator: React.FC<EvolutionIndicatorProps> = ({ 
  size = 'large' 
}) => {
  const style = size === 'large' 
    ? evolutionStyles.evolveIndicatorLarge 
    : evolutionStyles.evolveIndicatorSmall;
  
  return (
    <div className={style.className}>
      <span className="text-xs font-bold">{style.content}</span>
    </div>
  );
};