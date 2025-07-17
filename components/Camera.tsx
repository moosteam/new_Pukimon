"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CameraProps {
  currentPlayer: 'player1' | 'player2';
  onCapture: (imageDataUrl: string) => void;
  onError?: (error: string) => void;
}

export default function Camera({ currentPlayer, onCapture, onError }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');

  // 카메라 시작
  const startCamera = useCallback(async () => {
    setCameraState('starting');

    // 보안 컨텍스트 확인
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = !window.isSecureContext
        ? "카메라 기능은 HTTPS 또는 localhost에서만 사용 가능합니다."
        : "이 브라우저는 카메라를 지원하지 않습니다.";
      onError?.(message);
      setCameraState('error');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user' 
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // iOS 대응
        videoRef.current.setAttribute('autoplay', '');
        videoRef.current.setAttribute('playsinline', '');
      }
    } catch (err) {
      console.error("카메라 접근 실패:", err);
      let message = '카메라를 시작할 수 없습니다.';
      
      if (err instanceof DOMException) {
        switch(err.name) {
          case "NotAllowedError":
            message = '카메라 권한이 거부되었습니다.';
            break;
          case "NotFoundError":
            message = '카메라를 찾을 수 없습니다.';
            break;
          case "NotReadableError":
            message = '카메라가 이미 사용 중입니다.';
            break;
          default:
            message = `카메라 오류: ${err.message}`;
        }
      }
      
      onError?.(message);
      setCameraState('error');
    }
  }, [onError]);

  // 비디오 재생 준비 완료
  const handleCanPlay = useCallback(() => {
    setCameraState('running');
  }, []);

  // 사진 촬영
  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || cameraState !== 'running') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 좌우 반전 (셀카 모드)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 이미지 데이터 URL 생성
    const imageDataUrl = canvas.toDataURL('image/png');
    onCapture(imageDataUrl);
  }, [cameraState, onCapture]);

  // 카메라 정리
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, [stream]);

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  return (
    <div className="relative">
      {/* 카메라 뷰파인더 */}
      <div className="relative bg-gray-800 p-4 rounded-3xl shadow-2xl">
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video w-full max-w-[640px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={handleCanPlay}
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          
          {/* 촬영 가이드 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-4 border-white/50 rounded-full" />
            <div className="absolute text-white text-center">
              <div className="text-sm font-bold">얼굴을 원 안에</div>
              <div className="text-sm">맞춰주세요</div>
            </div>
          </div>
          
          {/* 상태 표시 */}
          {cameraState !== 'running' && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
              <div className="text-center">
                {cameraState === 'starting' && (
                  <>
                    <div className="text-2xl mb-2">⏳</div>
                    <p>카메라 준비 중...</p>
                  </>
                )}
                {cameraState === 'error' && (
                  <>
                    <div className="text-2xl mb-2">❌</div>
                    <p>카메라 오류</p>
                    <button 
                      onClick={startCamera}
                      className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                    >
                      다시 시도
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 촬영 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={capture}
          disabled={cameraState !== 'running'}
          className={`w-20 h-20 rounded-full font-bold text-4xl transition-all ${
            cameraState === 'running'
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-110 animate-pulse'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          📸
        </button>
      </div>
      
      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 