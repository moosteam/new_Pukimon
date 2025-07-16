import React from 'react';
import { useAtomValue } from 'jotai';
import { myGameScoreAtom, enemyGameScoreAtom, myTurnAtom } from '../atom';

interface GameEndOverlayProps {
  isVisible: boolean;
  onPlayAgain: () => void;
}

export const GameEndOverlay: React.FC<GameEndOverlayProps> = ({
  isVisible,
  onPlayAgain
}) => {
  const myGameScore = useAtomValue(myGameScoreAtom);
  const enemyGameScore = useAtomValue(enemyGameScoreAtom);
  const myTurn = useAtomValue(myTurnAtom);

  if (!isVisible) return null;

  // 승리자 결정
  const isMyWin = myGameScore >= 3;
  const winnerScore = isMyWin ? myGameScore : enemyGameScore;
  const loserScore = isMyWin ? enemyGameScore : myGameScore;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-auto"
      style={{ transform: myTurn ? "rotateZ(0deg)":"rotateZ(180deg)"}}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-80" />
      
      {/* 메인 컨테이너 - GameBoard 회전과 위치 고려 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 게임 엔딩 카드 */}
        <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 rounded-2xl p-8 shadow-2xl border-4 border-white/20 max-w-md w-full mx-4">
          {/* 배경 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-2xl animate-pulse" />
          
          {/* 내부 컨텐츠 */}
          <div className="relative z-10 text-center">
            {/* 승리 아이콘 */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-2xl flex items-center justify-center">
                <span className="text-4xl">
                  {isMyWin ? '🏆' : '💀'}
                </span>
              </div>
            </div>
            
            {/* 승리 메시지 */}
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {isMyWin ? '🎉 승리! 🎉' : '💀 패배! 💀'}
            </h1>
            
            {/* 플레이어 정보 */}
            <div className="mb-6">
              <div className="text-xl text-white/90 mb-2">
                {isMyWin ? '내가' : '상대방이'} 승리했습니다!
              </div>
              <div className="text-lg text-white/80">
                최종 점수: {winnerScore} - {loserScore}
              </div>
            </div>
            
            {/* 다시하기 버튼 */}
            <button
              onClick={onPlayAgain}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/20"
            >
              다시하기 🔄
            </button>
          </div>
          
          {/* 장식 효과 */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" />
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  );
}; 