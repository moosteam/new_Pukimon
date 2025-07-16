import React from 'react';
import { PlayerCard } from './PlayerCard';

interface PlayerCardProps {
  playerCardRotate: number;
  playerCardPosition: number;
  myImageSrc: string;
  emenyImageSrc: string;
}

export const PlayerCards: React.FC<PlayerCardProps> = ({ playerCardRotate, playerCardPosition, myImageSrc, emenyImageSrc }) => {
  return (
    <>
      {/* 플레이어 카드 1 */}
      <PlayerCard
          imageSrc={myImageSrc}
          rotate={playerCardRotate}
          position={playerCardPosition}
          translateY={4}
        />
        {/* 플레이어 카드 2 */}
        <PlayerCard
          imageSrc={emenyImageSrc}
          rotate={-playerCardRotate}
          position={-playerCardPosition}
          translateY={26}
        />
    </>
  );
};


