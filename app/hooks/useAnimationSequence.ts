import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  boardRotateZAtom,
  boardScaleAtom,
  boardOpacityAtom,
  playerCardRotateAtom,
  playerCardPositionAtom,
  startVideoAtom,
  coinTextOpacityAtom,
  boardRotateXAtom
} from "../atom";

export function useAnimationSequence() {
  const [boardRotateZ, setBoardRotateZ] = useAtom(boardRotateZAtom);
  const [boardScale, setBoardScale] = useAtom(boardScaleAtom);
  const [boardOpacity, setBoardOpacity] = useAtom(boardOpacityAtom);
  const [playerCardRotate, setPlayerCardRotate] = useAtom(playerCardRotateAtom);
  const [playerCardPosition, setPlayerCardPosition] = useAtom(playerCardPositionAtom);
  const [startVideo, setStartVideo] = useAtom(startVideoAtom);
  const [coinTextOpacity, setCoinTextOpacity] = useAtom(coinTextOpacityAtom);
  const [boardRotateX, setBoardRotateX] = useAtom(boardRotateXAtom);

  useEffect(() => {
    // 초기 상태 설정
    setBoardRotateZ(120);
    setBoardScale(1.5);
    setBoardOpacity(0);

    // 애니메이션 시퀀스 정의
    const animationSequence = [
      {
        time: 0,
        action: () => {
          setBoardRotateZ(0);
          setBoardScale(1);
          setPlayerCardRotate(-20);
          setPlayerCardPosition(0);
        }
      },
      {
        time: 2400,
        action: () => {
          setPlayerCardRotate(20);
          setPlayerCardPosition(60);
          setBoardScale(1.6);
        }
      },
      {
        time: 2600,
        action: () => {
          setStartVideo(true);
        }
      },
      {
        time: 4000,
        action: () => {
          setBoardScale(2.4);
          setCoinTextOpacity(100);
        }
      },
      {
        time: 5500,
        action: () => {
          setBoardScale(1);
          setCoinTextOpacity(0);
        }
      },
      {
        time: 6000,
        action: () => {
          setStartVideo(false);
        }
      },
      {
        time: 7000,
        action: () => {
          setBoardRotateX(12);
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
  }, []);

  return {
    boardRotateZ, setBoardRotateZ,
    boardScale, setBoardScale,
    boardOpacity, setBoardOpacity,
    playerCardRotate, setPlayerCardRotate,
    playerCardPosition, setPlayerCardPosition,
    startVideo, setStartVideo,
    coinTextOpacity, setCoinTextOpacity,
    boardRotateX, setBoardRotateX
  };
}