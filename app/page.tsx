"use client"

import { useState, useEffect } from 'react';
import { usePukimonListener } from './hooks/usePukimonListener';

export default function HomePage() {
  const [gameMode, setGameMode] = useState<'web' | 'card'>('web');
  const [profileMode, setProfileMode] = useState<'photo' | 'noPhoto'>('noPhoto');
  
  // Pukimon 리스너 훅 사용
  const { getCurrentPukimon, getPukimonHistory } = usePukimonListener(1000); // 1초마다 체크
  
  // Pukimon 감지 이벤트 리스너
  useEffect(() => {
    const handlePukimonDetected = (event: CustomEvent) => {
      console.log('새 Pukimon 감지됨:', event.detail.puki);
      // 여기서 추가적인 UI 업데이트나 알림을 표시할 수 있습니다
    };
    
    window.addEventListener('pukimonDetected', handlePukimonDetected as EventListener);
    
    return () => {
      window.removeEventListener('pukimonDetected', handlePukimonDetected as EventListener);
    };
  }, []);

  // 게임 시작 처리
  const handleGameStart = () => {
    if (profileMode === 'photo') {
      // 프로필 촬영을 선택했다면 카메라 페이지로 이동
      window.location.href = '/camera';
      return;
    }
    // 프로필 촬영을 선택하지 않았다면 바로 게임 시작
    window.location.href = '/game';
  };
  
  return (
    <div className="h-screen bg-[#FFCC01] flex items-center justify-center p-4 overflow-hidden">
      {/* 배경 애니메이션 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* 메인 컨테이너 */}
      <div className="relative bg-[#FFCC01] backdrop-blur-lg rounded-3xl shadow-2xl p-6 max-w-5xl w-full h-[95vh] overflow-y-auto scrollbar-hide">
        {/* 헤더 */}
        <div className="text-center mb-6">
          {/* 푸키몬 타이틀 이미지 */}
          <div className="mb-4">
            <img 
              src="/pukimon.png" 
              alt="푸키몬 로고" 
              className="mx-auto h-20 md:h-24 object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-black text-base md:text-lg">
            게임 설정을 선택하고 모험을 시작하세요!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 게임 설정 */}
          <div className="space-y-6">
            {/* 게임 모드 선택 */}
            <div>
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                🎯 게임 모드
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setGameMode('web')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    gameMode === 'web'
                      ? 'border-blue-500 bg-yellow-200 shadow-lg scale-105'
                      : 'border-gray-200 bg-yellow-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💻</div>
                    <div className="text-left">
                      <h4 className="font-bold text-base text-black">웹에서만 플레이</h4>
                      <p className="text-black text-sm">화면상의 카드로만 게임 진행</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setGameMode('card')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    gameMode === 'card'
                      ? 'border-purple-500 bg-yellow-200 shadow-lg scale-105'
                      : 'border-gray-200 bg-yellow-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📱</div>
                    <div className="text-left">
                      <h4 className="font-bold text-base text-black">카드 인식 사용</h4>
                      <p className="text-black text-sm">실제 카드를 카메라로 인식</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 프로필 설정 */}
            <div>
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                📸 프로필 설정
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setProfileMode('photo')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    profileMode === 'photo'
                      ? 'border-green-500 bg-yellow-200 shadow-lg scale-105'
                      : 'border-gray-200 bg-yellow-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📷</div>
                    <div className="text-left">
                      <h4 className="font-bold text-base text-black">프로필 촬영</h4>
                      <p className="text-black text-sm">카메라로 프로필 사진 촬영</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setProfileMode('noPhoto')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    profileMode === 'noPhoto'
                      ? 'border-orange-500 bg-yellow-200 shadow-lg scale-105'
                      : 'border-gray-200 bg-yellow-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🚫</div>
                    <div className="text-left">
                      <h4 className="font-bold text-base text-black">프로필 촬영 X</h4>
                      <p className="text-black text-sm">기본 아바타 사용</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 시작 버튼 */}
          <div className="flex flex-col justify-center">
            {/* 게임 시작 버튼 */}
            <div className="text-center">
              <button
                onClick={handleGameStart}
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-black font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
              >
                {profileMode === 'photo' ? '📷 프로필 촬영하기' : '🚀 게임 시작하기'}
              </button>
              <p className="text-black text-sm mt-3">
                {profileMode === 'photo' 
                  ? '프로필 촬영 페이지로 이동합니다'
                  : '클릭하면 게임이 시작됩니다'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}