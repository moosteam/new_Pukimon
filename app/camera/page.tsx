"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Camera from '@/components/Camera';

export default function CameraPage() {
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [capturedPhotos, setCapturedPhotos] = useState<{player1?: string, player2?: string}>({});
  const [isFlashing, setIsFlashing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 사진 촬영 핸들러
  const handleCapture = useCallback((imageDataUrl: string) => {
    // 플래시 효과
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    // 파일 다운로드
    const link = document.createElement('a');
    link.download = `${currentPlayer}.png`;
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 상태 업데이트
    setCapturedPhotos(prev => ({ ...prev, [currentPlayer]: imageDataUrl }));
    
    // 다음 플레이어로 이동 또는 완료
    if (currentPlayer === 'player1') {
      setCurrentPlayer('player2');
      alert('플레이어 1 촬영 완료! 이제 플레이어 2를 촬영해주세요.');
    } else {
      alert('모든 프로필 촬영이 완료되었습니다! 다운로드된 파일(player1.png, player2.png)을 public/ui/ 폴더로 옮겨주세요.');
    }
  }, [currentPlayer]);

  // 에러 핸들러
  const handleError = useCallback((error: string) => {
    setErrorMessage(error);
    alert(error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFCC01] flex items-center justify-center p-4">
      {/* 플래시 효과 */}
      {isFlashing && <div className="fixed inset-0 bg-white/80 z-50 animate-flash" />}
      
      <div className="relative bg-[#FFCC01] backdrop-blur-lg rounded-3xl shadow-2xl p-6 max-w-5xl w-full">
        <h1 className="text-center text-3xl font-bold text-black mb-6">📷 프로필 촬영</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 카메라 컴포넌트 */}
          <Camera
            currentPlayer={currentPlayer}
            onCapture={handleCapture}
            onError={handleError}
          />
          
          {/* 진행 상태 패널 */}
          <div className="flex flex-col items-center space-y-6">
            {/* 현재 플레이어 정보 */}
            <div className="bg-yellow-200 p-6 rounded-2xl border-2 border-gray-300 text-center w-full">
              <h3 className="text-xl font-bold text-black mb-4">
                {currentPlayer === 'player1' ? '플레이어 1' : '플레이어 2'} 촬영
              </h3>
              
              {/* 진행 상태 인디케이터 */}
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className={`flex flex-col items-center ${capturedPhotos.player1 ? 'text-green-600' : 'text-blue-500'}`}>
                  <p className="font-bold">P1</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    capturedPhotos.player1 ? 'bg-green-500' : currentPlayer === 'player1' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {capturedPhotos.player1 ? '✓' : '1'}
                  </div>
                </div>
                
                <div className="w-12 h-1 bg-gray-300" />
                
                <div className={`flex flex-col items-center ${capturedPhotos.player2 ? 'text-green-600' : currentPlayer === 'player2' ? 'text-blue-500' : 'text-black/50'}`}>
                  <p className="font-bold">P2</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    capturedPhotos.player2 ? 'bg-green-500' : currentPlayer === 'player2' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {capturedPhotos.player2 ? '✓' : '2'}
                  </div>
                </div>
              </div>
              
              {/* 상태 메시지 */}
              <p className="text-sm text-gray-700">
                {capturedPhotos.player1 && capturedPhotos.player2 
                  ? '모든 촬영이 완료되었습니다!' 
                  : `${currentPlayer === 'player1' ? '첫 번째' : '두 번째'} 플레이어의 프로필을 촬영해주세요`}
              </p>
            </div>
            
            {/* 촬영된 사진 미리보기 */}
            {(capturedPhotos.player1 || capturedPhotos.player2) && (
              <div className="bg-white/80 p-4 rounded-xl w-full">
                <h4 className="text-sm font-bold text-gray-700 mb-2">촬영된 사진</h4>
                <div className="flex gap-4 justify-center">
                  {capturedPhotos.player1 && (
                    <div className="text-center">
                      <img src={capturedPhotos.player1} alt="Player 1" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                      <p className="text-xs mt-1">P1</p>
                    </div>
                  )}
                  {capturedPhotos.player2 && (
                    <div className="text-center">
                      <img src={capturedPhotos.player2} alt="Player 2" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                      <p className="text-xs mt-1">P2</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 액션 버튼들 */}
            <div className="flex gap-4">
              <Link 
                href="/" 
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ← 뒤로가기
              </Link>
              
              {capturedPhotos.player1 && capturedPhotos.player2 && (
                <Link 
                  href="/game" 
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors animate-pulse"
                >
                  게임 시작 🚀
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* 안내 메시지 */}
        <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">📋 촬영 안내</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 얼굴을 화면 중앙의 원 안에 맞춰주세요</li>
            <li>• 📸 버튼을 눌러 사진을 촬영합니다</li>
            <li>• 촬영된 사진은 자동으로 다운로드됩니다</li>
            <li>• 다운로드된 파일을 <code className="bg-gray-200 px-1 rounded">public/ui/</code> 폴더에 저장해주세요</li>
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        .animate-flash {
          animation: flash 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
