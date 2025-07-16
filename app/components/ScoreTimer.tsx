import React, { useEffect, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { useAtomValue } from 'jotai';
import { myTurnAtom, myGameScoreAtom, enemyGameScoreAtom } from '../atom';

interface ScoreTimerProps {
  totalMinutes?: number;
  maxDeaths?: number;
  /** true면 오른쪽 상단, false면 왼쪽 하단에 배치 */
  isPrimary?: boolean;
}

export const ScoreTimer: React.FC<ScoreTimerProps> = ({
  totalMinutes = 20,
  maxDeaths = 3,
  isPrimary = false,
}) => {
  // 남은 시간(초)
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);
  const myTurn = useAtomValue(myTurnAtom);
  
  // ATOM에서 점수 가져오기
  const myGameScore = useAtomValue(myGameScoreAtom);
  const enemyGameScore = useAtomValue(enemyGameScoreAtom);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // 180도 뒤집힐 때 정보가 바뀌도록 수정
  const teamColor = isPrimary ? myTurn : !myTurn;
  const teamName = isPrimary ? (myTurn ? '레드팀' : '블루팀') : (!myTurn ? '레드팀' : '블루팀');
  
  // 현재 점수 결정 - 180도 뒤집힐 때 정보가 바뀌도록 수정
  const currentDeaths = isPrimary ? enemyGameScore : myGameScore;

  const renderElements = () => {
    const elements = [
      // 타이머
      isPrimary && (
        <div 
          key="timer"
          className="flex items-center space-x-1 px-2 py-0.5 rounded-4xl"
          style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        >
          <FiClock className={`w-5 h-5 ${teamColor ? 'text-red-400' : 'text-blue-400'}`} />
          <span className="font-mono">{formatted}</span>
        </div>
      ),

      // 팀 이름
      (
        <div 
          key="teamName"
          className={`font-semibold ${teamColor ? 'text-red-400' : 'text-blue-400'}`}
        >
          {teamName}
        </div>
      ),

      // 포켓몬 사망 표시
      <div key="deaths" className="flex space-x-2">
        {Array.from({ length: maxDeaths }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 m-1 ${
              i < currentDeaths
                ? `bg-gradient-to-br ${teamColor ? 'from-red-500 to-red-600 border-red-400' : 'from-blue-500 to-blue-600 border-blue-400'}`
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            }`}
            style={{
              boxShadow: i < currentDeaths 
                ? teamColor 
                  ? '0 0 8px rgba(239, 68, 68, 0.5)'
                  : '0 0 8px rgba(59, 130, 246, 0.5)'
                : 'none',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    ].filter(Boolean);

    return isPrimary ? elements.reverse() : elements;
  };

  return (
    <div 
      className={`fixed text-white shadow-lg flex items-center space-x-2 z-9999999 gap-3 ${
        isPrimary 
          ? 'top-0 right-0 rounded-bl-xl py-0.5 px-1.5' 
          : 'bottom-0 left-0 rounded-tr-xl py-0.5 px-1.5'
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(55, 65, 81, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transition: 'all 0.3s ease'
      }}
    >
      {renderElements()}
    </div>
  );
};

