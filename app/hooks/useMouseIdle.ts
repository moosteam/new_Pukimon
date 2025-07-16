import { useState, useEffect } from "react";

/**
 * 마우스가 일정 시간 동안 움직이지 않을 때 true를 반환하는 커스텀 훅
 * @param idleTime 마우스가 움직이지 않은 것으로 간주할 시간 (밀리초 단위, 기본값: 3000ms)
 * @returns 마우스가 idle 상태인지 여부
 */
export function useMouseIdle(idleTime: number = 300): boolean {
  const [isIdle, setIsIdle] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    // 마우스가 움직일 때마다 실행되는 핸들러
    const handleMouseMove = () => {
      // 이미 설정된 타임아웃이 있다면 초기화
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // idle 상태가 true였다면 false로 변경
      if (isIdle) {
        setIsIdle(false);
      }

      // 새로운 타임아웃 설정
      timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, idleTime);
    };

    // 최초 로딩 시 타임아웃 설정
    timeoutId = setTimeout(() => {
      setIsIdle(true);
    }, idleTime);

    // 이벤트 리스너 등록
    window.addEventListener("mousemove", handleMouseMove);

    // 클린업 함수
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [idleTime, isIdle]);

  return isIdle;
}
