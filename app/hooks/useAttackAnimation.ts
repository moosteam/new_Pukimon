import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { boardScaleAtom } from "../atom";

export function useAttackAnimation() {
  const [boardScale, setBoardScale] = useAtom(boardScaleAtom);
  const [isAttacking, setIsAttacking] = useState(false);

  const triggerAttackAnimation = () => {
    if (isAttacking) return; // 이미 애니메이션 중이면 중복 실행 방지
    
    setIsAttacking(true);

    // 애니메이션 시퀀스
    const animationSequence = [
      {
        time: 0,
        action: () => {
          // 공격 시작: 스케일 확대
          setBoardScale(1.3);
        }
      },
      {
        time: 100,
        action: () => {
          // 공격 종료: 원래 상태로 복귀
          setBoardScale(1);
          setIsAttacking(false);
        }
      }
    ];

    // 타이머 설정 및 실행
    const timers = animationSequence.map(({ time, action }) => {
      return setTimeout(action, time);
    });

    // 클린업: 모든 타이머 제거
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  };

  return {
    boardScale,
    isAttacking,
    triggerAttackAnimation
  };
} 