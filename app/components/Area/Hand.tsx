import React, { useState, useCallback, useRef } from 'react';
import { Draggable } from '../Draggable';
import { useAtomValue } from 'jotai';
import { myTurnAtom } from '../../atom';
import { myHandListAtom, enemyHandListAtom } from '../../atom';
import { motion, AnimatePresence } from 'framer-motion';

interface HandProps {
    isMy: any;
}

export const Hand: React.FC<HandProps> = ({ isMy }) => {
    const myTurn = useAtomValue(myTurnAtom);

    const [isCardZoomed, setIsCardZoomed] = useState(false);
    const [zoomedCardSrc, setZoomedCardSrc] = useState("");
    const handList = useAtomValue(isMy ? myHandListAtom : enemyHandListAtom);
    
    // 드래그 시작 여부를 추적
    const isDraggingRef = useRef(false);
    // 마우스 다운 시간 추적
    const mouseDownTimeRef = useRef(0);

    const openZoom = useCallback((cardName: string) => {
        console.log("Opening zoom for card:", cardName);
        setZoomedCardSrc(`card/${cardName}.png`);
        setIsCardZoomed(true);
    }, []);

    const closeZoom = useCallback(() => {
        console.log("Closing zoom");
        setIsCardZoomed(false);
    }, []);

    return (
        <div className="z-[999999999999999999999] flex flex-row justify-center items-center ">
            {/* Card zoom overlay with framer-motion */}
            <AnimatePresence>
                {isCardZoomed && (
                    <motion.div
                        className="fixed inset-0 z-[999999999999999999999999999999] flex items-center justify-center top-40"
                        onClick={closeZoom}
                        style={{ 
                            transform: 'none',
                            perspective: 'none'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="relative w-[60%]" 
                            style={{ transform: 'none' }}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ 
                                type: "spring", 
                                damping: 25, 
                                stiffness: 300,
                                duration: 0.4
                            }}
                        >
                            <img
                                src={zoomedCardSrc}
                                alt="Card Preview"
                                className="w-full rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                                style={{ transform: 'none' }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add a CSS class for the container to properly handle the animation */}
            <div className="flex flex-row items-center justify-center">
                {handList && handList.map((card: any, index: any) => {
                    const cardId = `card-${index}`;
                    // Only show cards that haven't been played yet
                    return (
                        <div 
                            key={isMy ? `card-container-${index}` : `enemy-card-container-${index}`} 
                            className="relative"
                        >
                            <Draggable
                                isReversed={!isMy}
                                key={isMy ? `draggable-${card}-${index}` : `enemy-draggable-${card}-${index}`}
                                id={isMy ? `${cardId}` : `enemy${cardId}`}
                                imgLink={`card/${card}.png`}
                            >
                                <div
                                    className={`relative card-entry-animation${isMy ? "" : "-reverse"}`}
                                    onMouseDown={(e) => {
                                        // 마우스 다운 시간 기록
                                        mouseDownTimeRef.current = Date.now();
                                        isDraggingRef.current = false;
                                    }}
                                    onMouseMove={() => {
                                        // 마우스 이동 시 드래그 중으로 표시
                                        if (mouseDownTimeRef.current > 0) {
                                            isDraggingRef.current = true;
                                        }
                                    }}
                                    onMouseUp={(e) => {
                                        // 마우스 업 시 클릭인지 드래그인지 판단
                                        const clickDuration = Date.now() - mouseDownTimeRef.current;
                                        
                                        // 짧은 클릭이고 드래그가 아니면 확대 기능 활성화
                                        if (clickDuration < 200 && !isDraggingRef.current) {
                                            openZoom(card);
                                        }
                                        
                                        mouseDownTimeRef.current = 0;
                                    }}
                                    onTouchStart={() => {
                                        // 터치 시작 시간 기록
                                        mouseDownTimeRef.current = Date.now();
                                        isDraggingRef.current = false;
                                    }}
                                    onTouchMove={() => {
                                        // 터치 이동 시 드래그 중으로 표시
                                        isDraggingRef.current = true;
                                    }}
                                    onTouchEnd={() => {
                                        // 터치 종료 시 클릭인지 드래그인지 판단
                                        const clickDuration = Date.now() - mouseDownTimeRef.current;
                                        
                                        // 짧은 터치이고 드래그가 아니면 확대 기능 활성화
                                        if (clickDuration < 200 && !isDraggingRef.current) {
                                            openZoom(card);
                                        }
                                        
                                        mouseDownTimeRef.current = 0;
                                    }}
                                >
                                    <img
                                        src={`card/${card}.png`}
                                        alt=""
                                        className="w-18 transition-all duration-500 cursor-grab hover:scale-110"
                                        style={{
                                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                            transform: myTurn ? "scale(1)" : "scale(-1, -1)",
                                            transformOrigin: "center center",
                                            perspective: "1000px"
                                        }}
                                    />
                                </div>
                            </Draggable>
                        </div>
                    );
                })}
                {handList.length === 0 &&
                    <img
                        src="card/리자몽ex.png"
                        alt=""
                        className="w-18 transition-all duration-1500 invisible"
                    />
                }
            </div>
        </div>
    )
}

// 카드 확대 기능 배경 제거

// 현재 카드 확대 기능이 잘 작동하고 있네요! 요청하신 대로 확대된 카드의 배경을 제거하겠습니다.
