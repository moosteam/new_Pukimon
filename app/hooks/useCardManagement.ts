import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { 
  isEnemyDrawCardAtom, 
  isMyDrawCardAtom, 
  isNowTurnGiveEnergyAtom, 
  myTurnAtom,
  boardRotateZAtom, 
  boardRotateXAtom,
  myCardListAtom,
  enemyCardListAtom,
  myHandListAtom,
  enemyHandListAtom,
  droppedCardsAtom,
  gameTurnCountAtom,
} from "../atom";

export function useCardManagement() {
  // useGameState 대신 jotai의 atom 사용
  const [myCardList, setMyCardList] = useAtom(myCardListAtom);
  const [enemyCardList, setEnemyCardList] = useAtom(enemyCardListAtom);
  const [myHandList, setMyHandList] = useAtom(myHandListAtom);
  const [enemyHandList, setEnemyHandList] = useAtom(enemyHandListAtom);
  const [isNowTurnGiveEnergy, setIsNowTurnGiveEnergy] = useAtom(isNowTurnGiveEnergyAtom);
  const [myTurn, setMyTurn] = useAtom(myTurnAtom);
  
  const [, setIsMyDrawCard] = useAtom(isMyDrawCardAtom);
  const [, setIsEnemyDrawCard] = useAtom(isEnemyDrawCardAtom);
  
  const addCardToMyHand = (cycle: number) => {
    const initialCards = myCardList.slice(0, cycle);
    setMyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setIsMyDrawCard(prev => prev + 1)
        setMyHandList(prev => [...prev, card]);
      }, 200 * index);
    });
  };

  const addCardToEnemyHand = (cycle: number) => {
    const initialCards = enemyCardList.slice(0, cycle);
    setEnemyCardList(prev => prev.slice(cycle));

    initialCards.forEach((card, index) => {
      setTimeout(() => {
        setIsEnemyDrawCard(prev => prev + 1)
        setEnemyHandList(prev => [...prev, card]);
      }, 200 * index);
    });
  };

  // onEndTurn 함수 내에서 useAtom 호출 제거 (React 훅 규칙 위반)
  // 대신 외부에서 선언된 atom 값 사용
  const [boardRotateZ, setBoardRotateZ] = useAtom(boardRotateZAtom);
  const [boardRotateX, setBoardRotateX] = useAtom(boardRotateXAtom);
  const [gameTurnCount, setGameTurnCount] = useAtom(gameTurnCountAtom);
  
  const onEndTurn = () => {
    setBoardRotateZ(boardRotateZ + 180);
    setIsNowTurnGiveEnergy(false);
    setBoardRotateX(boardRotateX * -1);
    
    // 턴 카운터 증가
    setGameTurnCount(prev => prev + 1);
    
    if (!myTurn) {
      if (myHandList.length === 0) {
        addCardToMyHand(4);
      } else {
        addCardToMyHand(1);
      }
    } else {
      if (enemyHandList.length === 0) {
        addCardToEnemyHand(4);
      } else {
        addCardToEnemyHand(1);
      }
    }
    
    setMyTurn(!myTurn);
  };

  return {
    addCardToMyHand,
    addCardToEnemyHand,
    onEndTurn,
    myHandList,
    enemyHandList
  };
}