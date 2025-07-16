import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { myGameScoreAtom, enemyGameScoreAtom, myTurnAtom } from '../atom';

interface ScoreAnimationProps {
  isVisible: boolean;
  isMyScore: boolean;
  onAnimationComplete: () => void;
  profileImg?: string;
  nickname?: string;
}

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  isVisible,
  isMyScore,
  onAnimationComplete,
  profileImg = "/ui/player1.png",
  nickname = "포켓마스터"
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showScoreGlow, setShowScoreGlow] = useState(false);
  const [showCardBounce, setShowCardBounce] = useState(false);
  const [showScoreRise, setShowScoreRise] = useState(false);

  const myGameScore = useAtomValue(myGameScoreAtom);
  const enemyGameScore = useAtomValue(enemyGameScoreAtom);
  const myTurn = useAtomValue(myTurnAtom);

  // 현재 스코어에 +1 (애니메이션 진행 중에는 아직 점수가 업데이트되지 않았으므로)
  const currentScore = (isMyScore ? myGameScore : enemyGameScore) + 1;

  // 적 차례에서 애니메이션이 실행될 때 회전 여부 결정
  const shouldRotate = !isMyScore && !myTurn;

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      
      // 0.3초 후 카드 바운스 효과
      const bounceTimer = setTimeout(() => {
        setShowCardBounce(true);
      }, 300);
      
      // 0.8초 후 점수 상승 효과
      const riseTimer = setTimeout(() => {
        setShowScoreRise(true);
      }, 800);
      
      // 1.2초 후 점수 글로우 효과
      const glowTimer = setTimeout(() => {
        setShowScoreGlow(true);
      }, 1200);
      
      // 3초 후 애니메이션 완료
      const completeTimer = setTimeout(() => {
        setShowAnimation(false);
        setShowScoreGlow(false);
        setShowCardBounce(false);
        setShowScoreRise(false);
        onAnimationComplete();
      }, 3000);
      
      return () => {
        clearTimeout(bounceTimer);
        clearTimeout(riseTimer);
        clearTimeout(glowTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <>
      {/* 전체 화면 오버레이 - GameBoard transform 완전 무시 */}
      <div 
        className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none"
        style={{ 
          transform: shouldRotate ? 'rotateZ(180deg)' : 'none',
          perspective: 'none !important',
          transformStyle: 'flat',
          isolation: 'isolate'
        }}
      >

        
        {/* 반짝이는 파티클 효과 */}
        {showAnimation && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* 메인 컨테이너 */}
        <div 
          className={`
            relative transition-all duration-1000 ease-out
            ${showAnimation ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-12'}
            ${showCardBounce ? 'animate-bounceIn' : ''}
          `}
          style={{ 
            transform: showAnimation 
              ? `scale(1) translateY(0px) ${showCardBounce ? 'rotateY(5deg)' : 'rotateY(0deg)'}` 
              : 'scale(0.5) translateY(12px) rotateY(0deg)',
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          
          {/* 글로우 배경 효과 */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 via-sky-300/40 to-blue-500/30 rounded-3xl blur-3xl scale-110 transition-all duration-1000 ${showScoreGlow ? 'scale-150 opacity-80' : 'scale-110 opacity-30'}`} />
          
          {/* 프로필 이미지 */}
          <div className="relative -mb-16 z-20 flex justify-center">
            <div className={`relative transition-all duration-800 ${showCardBounce ? 'animate-profileFloat' : ''}`}>
              {/* 프로필 외곽 글로우 */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full blur-lg transition-all duration-1000 ${showScoreGlow ? 'scale-130 opacity-80' : 'scale-110 opacity-60'}`} />
              
              {/* 프로필 컨테이너 */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white via-blue-50 to-blue-100 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
                  <img
                    src={profileImg}
                    alt="profile"
                    className={`w-32 h-32 rounded-full object-cover shadow-lg transition-all duration-500 ${showCardBounce ? 'scale-105' : 'scale-100'}`}
                  />
                </div>
              </div>
              
              {/* 프로필 테두리 애니메이션 */}
              <div className={`absolute inset-0 rounded-full border-4 border-white/50 transition-all duration-1000 ${showScoreGlow ? 'animate-pulse scale-110' : ''}`} />
              
              {/* 승리 이펙트 링 */}
              {showScoreGlow && (
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping" />
              )}
            </div>
          </div>
          
          {/* 메인 카드 */}
          <div className={`relative bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8 pt-20 min-w-[480px] transition-all duration-1000 ${showCardBounce ? 'shadow-3xl' : 'shadow-2xl'}`}>
            
            {/* 카드 내부 글로우 */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl transition-opacity duration-1000 ${showScoreGlow ? 'opacity-30' : 'opacity-100'}`} />
            
            {/* 승리 리본 */}
            {showScoreRise && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-slideDown">
                  🏆 승리! 🏆
                </div>
              </div>
            )}
            
            {/* 닉네임 */}
            <div className="text-center mb-8">
              <h2 className={`text-white font-black tracking-wide drop-shadow-lg transition-all duration-800 ${showScoreRise ? 'text-4xl animate-textGlow' : 'text-3xl'}`}>
                {nickname}
              </h2>
            </div>
            
            {/* 점수 표시 */}
            <div className="flex justify-center items-center gap-8">
              {[1, 2, 3].map((num) => {
                const isActive = num <= currentScore;
                const isCurrent = num === currentScore;
                
                return (
                  <div key={num} className="relative">
                    
                    {/* 점수 글로우 배경 */}
                    {isCurrent && showScoreGlow && (
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl scale-200 opacity-60 animate-pulse" />
                    )}
                    
                    {/* 스코어 상승 이펙트 */}
                    {isCurrent && showScoreRise && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-300 font-bold text-xl animate-scoreRise">
                        +1
                      </div>
                    )}
                    
                    {/* 점수 원 */}
                    <div
                      className={`
                        relative w-20 h-20 rounded-full flex items-center justify-center
                        font-black text-4xl border-4 transition-all duration-700
                        ${isActive 
                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 text-blue-900 shadow-2xl' 
                          : 'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-100 text-blue-600 opacity-60'
                        }
                        ${isCurrent && showScoreGlow ? 'scale-125 animate-scoreJump' : ''}
                        ${isCurrent && showScoreRise ? 'animate-scoreGrow' : ''}
                      `}
                      style={{
                        boxShadow: isActive 
                          ? '0 0 40px rgba(255, 235, 59, 0.8), 0 12px 30px rgba(0, 0, 0, 0.4)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {num}
                      
                      {/* 활성 점수 내부 글로우 */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                      )}
                      
                      {/* 활성화 이펙트 */}
                      {isCurrent && showScoreRise && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-transparent rounded-full animate-flash" />
                      )}
                    </div>
                    
                    {/* 점수 하이라이트 링 */}
                    {isCurrent && showScoreGlow && (
                      <>
                        <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-ping opacity-75" />
                        <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 하단 장식 */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-b-3xl" />
          </div>
          
          {/* 카드 하단 그림자 */}
          <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 rounded-full blur-xl" />
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.8) rotateY(-10deg); }
          50% { transform: scale(1.05) rotateY(5deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }
        
        @keyframes profileFloat {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-8px) rotateZ(2deg); }
        }
        
        @keyframes slideDown {
          0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0px); opacity: 1; }
        }
        
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 235, 59, 0.6); }
        }
        
        @keyframes scoreRise {
          0% { transform: translateX(-50%) translateY(0px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        }
        
        @keyframes scoreJump {
          0%, 20%, 50%, 80%, 100% { transform: scale(1.25) rotateZ(0deg); }
          40% { transform: scale(1.35) rotateZ(5deg); }
          60% { transform: scale(1.35) rotateZ(-5deg); }
        }
        
        @keyframes scoreGrow {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
        
        .animate-profileFloat {
          animation: profileFloat 2s ease-in-out infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        
        .animate-textGlow {
          animation: textGlow 2s ease-in-out infinite;
        }
        
        .animate-scoreRise {
          animation: scoreRise 1.5s ease-out;
        }
        
        .animate-scoreJump {
          animation: scoreJump 1s ease-in-out;
        }
        
        .animate-scoreGrow {
          animation: scoreGrow 0.8s ease-out;
        }
        
        .animate-flash {
          animation: flash 1s ease-in-out;
        }
      `}</style>
    </>
  );
}; 