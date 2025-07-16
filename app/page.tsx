"use client"

import { useEffect } from "react";
import { DndContext } from '@dnd-kit/core';
import { OpeningOverlay } from "./components/AnimationManager/OpeningOverlay";
import { CoinAnimation } from "./components/AnimationManager/CoinAnimation";
import { PlayerCards } from "./components/Card/PlayerCards";
import { GameBoard } from "./components/BattleField/GameBoard";
import { FieldCards } from "./components/BattleField/FieldCards";
import { Hand } from "./components/Area/Hand";
import { Waiting } from "./components/Area/Waiting";
import { ScoreTimer } from "./components/ScoreTimer";
// Import custom hooks
import { useAnimationSequence } from "./hooks/useAnimationSequence";
import { useCardManagement } from "./hooks/useCardManagement";
import { useDragHandlers } from "./hooks/useDragHandlers";
import { useBGM } from "./hooks/useBGM";
import { showFullScreenEffectAtom } from "./atom";
import { useAtom } from "jotai";
import { showScoreAnimationAtom, scoreAnimationPropsAtom } from "./atom";
import { ScoreAnimation } from "./components/ScoreAnimation";

import { BGMStartPrompt } from "./components/BGMStartPrompt";

export default function App() {
  // Use animation hook
  const {
    boardRotateZ, 
    boardOpacity,
    playerCardRotate,
    playerCardPosition,
    startVideo,
    coinTextOpacity,
  } = useAnimationSequence();

  // Use attack animation hook
  const {
    boardScale,
  } = useAnimationSequence();

  const {
    addCardToMyHand,
  } = useCardManagement();

  // Use drag handlers hook
  const { handleDragEnd } = useDragHandlers();

  // Use BGM hook
  const { currentBGM, hasUserInteracted } = useBGM();

  const [showFullScreenEffect, setShowFullScreenEffect] = useAtom(showFullScreenEffectAtom);
  const [showScoreAnimation] = useAtom(showScoreAnimationAtom);
  const [scoreAnimationProps] = useAtom(scoreAnimationPropsAtom);

  // Initial card draw effect
  useEffect(() => {
    // 10초 후에 실행될 타이머 설정
    const timer = setTimeout(() => {
      addCardToMyHand(4);
    }, 8000); // 10000ms = 10초

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* 전체 화면 이펙트 */}
      {showFullScreenEffect && (
        <div className="fixed inset-0 z-[99999] pointer-events-none">
          <video
            autoPlay
            muted={true}
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setShowFullScreenEffect(false)}
          >
            <source src="/fullscreeneffect.webm" type="video/webm" />
          </video>
        </div>
      )}

      {/* 점수 애니메이션 - GameBoard와 완전 분리 */}
      {showScoreAnimation && (
        <ScoreAnimation {...scoreAnimationProps} />
      )}

      <div className="w-full h-full bg-[#C2DAF6] relative overflow-hidden">
        {/* BGM 시작 프롬프트 */}
        <BGMStartPrompt hasUserInteracted={hasUserInteracted} />
        <ScoreTimer isPrimary/>
        <ScoreTimer/>
        {/* 플레이어 카드 */}
        <PlayerCards
          playerCardRotate={playerCardRotate}
          playerCardPosition={playerCardPosition}
          myImageSrc={"/ui/player1.png"}
          emenyImageSrc={"/ui/player2.png"}
        />
        {/* 오프닝 애니메이션 오버레이 */}
        <OpeningOverlay boardOpacity={boardOpacity} />
        {/* 게임 필드 */}
        <GameBoard boardRotateZ={boardRotateZ} boardScale={boardScale}>
          {/* 적 카드 영역 */}
          <Hand isMy={false}/>
          {/* 필드 카드 영역 */}
          <Waiting isMy={false} />
          {/* 중앙 카드 영역 */}
          <FieldCards />
          {/* 하단 필드 카드 영역 */}
          <Waiting isMy={true} />
          {/* 내 핸드 영역 - 드래그 가능한 카드들 */}
          <Hand isMy={true} />
          {/* 비디오 영역 */}
          <CoinAnimation startVideo={startVideo} coinTextOpacity={coinTextOpacity} />
        </GameBoard>
      </div>
    </DndContext>
  );
}