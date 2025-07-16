import React, { useRef, useEffect } from 'react';

interface AutoplayVideoProps {
  src: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  type?: string; // 비디오 타입을 위한 prop 추가
  style?: string
}

const AutoplayVideo: React.FC<AutoplayVideoProps> = ({
  src,
  className,
  width = "4rem", // 크기 줄이기
  height = "4rem", // 크기 줄이기
  type = 'video/webm', // 기본값은 mp4로 설정
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
   
    if (videoElement) {
      // 비디오가 로드되면 자동 재생
      const handleLoadedData = (): void => {
        // 일부 브라우저에서는 Promise를 반환하므로 가능한 경우 처리
        const playPromise = videoElement.play();
       
        if (playPromise !== undefined) {
          playPromise.catch((error: Error) => {
            console.error('자동 재생 실패:', error);
          });
        }
      };
     
      // 비디오가 끝에 도달하면 멈춤
      const handleEnded = (): void => {
        // 마지막 프레임에서 멈추도록 currentTime을 조정
        videoElement.currentTime = videoElement.duration - 0.01;
        videoElement.pause();
      };
     
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('ended', handleEnded);
     
      return () => {
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      width={width}
      height={height}
      playsInline
      muted // 대부분의 브라우저에서 자동 재생을 위해 muted 필요
      controls={false} // 컨트롤 바 숨김
    >
        <source src={src} type={type}/>     
    </video>
  );
};

export default AutoplayVideo;
