'use client'

import { useState, useEffect, useCallback } from "react";
import { useAtomValue, useAtom } from "jotai";
import { data } from "../../data/cards";
import { 
    myTurnAtom,
    droppedCardsAtom,
    attackScaleAtom,
    showFullScreenEffectAtom,
} from "../../atom";
import { BattleCard } from "./BattleCard";
import { DeckArea } from "../Area/DeckArea";
import { useFieldCards } from "../../hooks/useFieldCards";
import SlidingBanner from "../SlidingBanner";
import { useCardManagement } from "../../hooks/useCardManagement";
import { ScoreAnimation } from "../ScoreAnimation";
import { GameEndOverlay } from "../GameEndOverlay";
import { useAttackListener } from "@/app/hooks/useAttackListener";


export const FieldCards = () => {
    const myTurn = useAtomValue(myTurnAtom);
    const droppedCards = useAtomValue(droppedCardsAtom);
    const { onEndTurn } = useCardManagement();
    
    const {
        isReadyToAttack,
        setIsReadyToAttack,
        attackingCard,
        setAttackingCard,
        gameOver,
        isMyAttack,
        isEnemyAttack,
        handleAttack,
        handleRetreat,
        myBattlePokemonEnergy,
        myBattlePokemonHP,
        enemyBattlePokemonEnergy,
        enemyBattlePokemonHP,
        myGameScore,
        enemyGameScore,
        showScoreAnimation,
        scoreAnimationType,
        handleScoreAnimationComplete
    } = useFieldCards({
        onEndTurn
    });

    const [showAttackEffect, setShowAttackEffect] = useState(false);
    const [attackPosition, setAttackPosition] = useState<'opponent' | 'player'>('opponent');
    const [showSlidingBanner, setShowSlidingBanner] = useState(false);
    const [currentSkill, setCurrentSkill] = useState<{ name: string; damage: number; energy: number } | null>(null);
    const [attackScale, setAttackScale] = useAtom(attackScaleAtom);
    const [showFullScreenEffect, setShowFullScreenEffect] = useAtom(showFullScreenEffectAtom);

    useEffect(() => {
        if (isMyAttack || isEnemyAttack) {
            // 공격 위치 설정 - 내 턴일 때는 상대방 위치에, 상대방 턴일 때는 내 위치에
            setAttackPosition(myTurn ? 'opponent' : 'player');
            // 슬라이딩 배너 표시
            setShowSlidingBanner(true);
            setShowFullScreenEffect(true); // 전체 이펙트도 시작
            
                        // Charging sound 재생
            const chargingSound = new Audio('/soundeffect/Charging.mp3');
            chargingSound.volume = 1;
            chargingSound.play().catch(error => {
                console.log('Charging 사운드 재생 실패:', error);
            });
            
            // 공격 애니메이션 시작
            setAttackScale(1.3);
            setTimeout(() => {
                setAttackScale(1);
            }, 1400);
            
            // 1.75초 후에 이펙트 표시
            const timer = setTimeout(() => {
                setShowAttackEffect(true);
            }, 1600);
            return () => {
                clearTimeout(timer);
                setShowAttackEffect(false);
            };
        } else {
            // 공격이 끝나면 슬라이딩 배너 숨기기
            setShowSlidingBanner(false);
            setCurrentSkill(null);
            setShowFullScreenEffect(false);
        }
    }, [isMyAttack, isEnemyAttack, myTurn]);

    // 현재 공격하는 포켓몬의 정보 가져오기
    const getCurrentPokemonInfo = () => {
        if (!attackingCard || !droppedCards[attackingCard]) return null;
        return data[droppedCards[attackingCard]];
    };

    // 스킬 클릭 핸들러 수정
    const handleSkillClick = (skill: { name: string; damage: number; energy: number }) => {
        setCurrentSkill(skill);
        handleAttack(skill);
    };

    // 백엔드 공격 신호가 왔을 때 자동으로 첫 번째 스킬을 실행하는 콜백
    const fireFirstSkill = useCallback(() => {
        const cardId = myTurn ? 'my_battle' : 'enemy_battle';
        const path = droppedCards[cardId];
        if (!path) return;
        const firstSkill = data[path]?.skill?.[0];
        if (!firstSkill) return;

        if (!isReadyToAttack) {
            // 먼저 준비 상태로 만들고, 짧은 지연 후 스킬 실행
            setAttackingCard(cardId);
            setIsReadyToAttack(true);
            setTimeout(() => handleSkillClick(firstSkill), 150);
        } else {
            handleSkillClick(firstSkill);
        }
    }, [myTurn, isReadyToAttack, droppedCards]);

    // 공격 리스너 훅 사용 (페이지마다 한 번 호출해야 하므로 컴포넌트 최상위에서 호출)
    useAttackListener({ onAttack: fireFirstSkill, pollInterval: 500 });

    return (
        <div className={`z-50 flex flex-row w-full justify-between items-center ${showScoreAnimation ? 'pointer-events-none' : ''}`}>
            {/* 전체 화면 이펙트 */}
            {/* 전체 화면 이펙트 렌더링 부분은 삭제 (app/page.tsx에서 렌더링 예정) */}
            {/* 점수 애니메이션 */}
            <ScoreAnimation
                isVisible={showScoreAnimation}
                isMyScore={scoreAnimationType === 'my'}
                onAnimationComplete={handleScoreAnimationComplete}
            />
           
            {
                showSlidingBanner && currentSkill && getCurrentPokemonInfo() &&      
                <SlidingBanner
                    title={currentSkill.name}
                    subtitle={getCurrentPokemonInfo()!.name}
                    bgColor="bg-red-600"
                    textColor="text-white"
                    tiltAngle="-8deg"
                    isReverse={isEnemyAttack}
                />
            }
            {
                showAttackEffect &&       
                <div className={`attack-effect ${attackPosition}`}>
                    <video
                        autoPlay
                        muted={true}
                        playsInline
                        onLoadedMetadata={(e) => {
                            // 공격 사운드 이펙트 재생
                            const attackSound = new Audio('/soundeffect/Attack.mp4');
                            attackSound.volume = 1;
                            attackSound.play().catch(error => {
                                console.log('공격 사운드 재생 실패:', error);
                            });
                        }}
                        onEnded={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.remove();
                            setShowAttackEffect(false);
                        }}
                    >
                        <source src="/Bomb.webm" type="video/webm" />
                    </video>
                </div>
            }
            
            {isReadyToAttack && !gameOver && (
                <div className={`${myTurn ? 'items-end justify-end w-full h-full ' : 'items-start justify-start  w-[100%] h-[90%]'} absolute flex  is-ready-to-attack-apr`} style={{ zIndex: 9999 }}>
                    <img 
                        src={droppedCards[attackingCard || 'my_battle']} 
                        alt=""
                        onClick={() => {
                            setIsReadyToAttack(false);
                        }}
                        className={`m-12 w-60 is-ready-to-attack-inf ${!myTurn ? 'scale-x-[-1] scale-y-[-1]' : ''}`}
                        style={{ 
                            position: 'relative', 
                            zIndex: 10000,
                            transition: 'transform 0.3s ease'
                        }}
                    />
                    <div className={`flex flex-col w-36 my-24 mx-12 absolute justify-end items-end ${!myTurn ? 'scale-x-[-1] scale-y-[-1]' : ''}`}
                        style={{ 
                            zIndex: 10001,
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {data[droppedCards[attackingCard || 'my_battle']].skill.map((skill, index) => (
                            <div 
                                key={index} 
                                className="
                                    mb-2
                                    p-3 
                                    rounded-lg 
                                    shadow-lg 
                                    border-2 
                                    border-gray-400 
                                    z-9 
                                    w-72
                                    cursor-pointer
                                    font-bold
                                    text-black
                                    "
                                style={{
                                    background: 'linear-gradient(135deg, #ABABAB 0%, #EDEDED 50%, #ABABAB 100%)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2)',
                                }}
                                onClick={() => handleSkillClick(skill)}
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex items-center">
                                        {Array(skill.energy >= 5 ? 1 : skill.energy).fill(0).map((_, i) => (
                                            <img 
                                                key={i} 
                                                src="/ui/energy.png"
                                                className="h-[1.5rem]"
                                                style={{marginLeft: i > 0 ? '-0.5rem' : '0'}}
                                            />
                                        ))}
                                        {skill.energy >= 5 &&
                                            <span className="ml-1 font-bold">{skill.energy}</span>
                                        }
                                    </div>
                                    <div>{skill.name}</div>
                                    <div>{skill.damage}</div>
                                </div>
                            </div>
                        ))}
                        <div
                          className="
                            bg-gray-300 
                            text-gray-900 
                            flex
                            items-center
                            justify-between
                            p-3
                            rounded-lg 
                            shadow-lg 
                            border-2 
                            border-gray-400 
                            z-10
                            font-bold
                            w-48
                            h-8
                            "
                          onClick={handleRetreat}
                        >
                                <div className="flex items-center gap-1">
                            {Array(data[droppedCards[attackingCard || 'my_battle']].retreatCost).fill(0).map((_, i) => (
                                    <img 
                                        key={i} 
                                        src="/ui/energy.png"
                                        className="h-[1rem]"
                                        style={{marginLeft: i > 0 ? '-0.5rem' : '0'}}
                                    />
                            ))}
                                </div>
                            <div>후퇴</div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 적의 효과칸과 덱 */}
            <DeckArea isMyDeck={false} onEndTurn={onEndTurn}/>
            
            {/* 배틀 필드 */}
            <div>
                <BattleCard 
                    id="enemy_battle"
                    isMyCard={false}
                    droppedCards={droppedCards}
                    energy={enemyBattlePokemonEnergy}
                    hp={enemyBattlePokemonHP}
                    isAttack={isEnemyAttack}
                    onCardClick={() => {
                        if (!myTurn && droppedCards['enemy_battle']) {
                            setAttackingCard('enemy_battle');
                            setIsReadyToAttack(true);
                        }
                    }}
                />
                
                <BattleCard 
                    id="my_battle"
                    isMyCard={true}
                    droppedCards={droppedCards}
                    energy={myBattlePokemonEnergy}
                    hp={myBattlePokemonHP}
                    isAttack={isMyAttack}
                    onCardClick={() => {
                        if (myTurn && droppedCards['my_battle']) {
                            setAttackingCard('my_battle');
                            setIsReadyToAttack(true);
                        }
                    }}
                />
            </div>
            
            {/* 나의 효과칸과 덱 */}
            <DeckArea isMyDeck={true} onEndTurn={onEndTurn} />
            {/* GameEndOverlay: 게임 종료 시 오버레이 */}
            {gameOver && (
                <GameEndOverlay
                    isVisible={true}
                    onPlayAgain={() => window.location.reload()}
                />
            )}
        </div>
    );
};