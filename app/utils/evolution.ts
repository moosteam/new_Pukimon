import { pokemonPlacementTurnAtom, gameTurnCountAtom, myTurnAtom, droppedCardsAtom } from "../atom";
import { useAtomValue } from "jotai";

/**
 * 포켓몬 진화 가능 여부를 확인하는 훅
 * @param cardId 카드 ID
 * @param isMyCard 내 카드인지 여부
 * @param droppedCards 배치된 카드 정보
 * @returns 진화 가능 여부
 */
export const useCanEvolve = (cardId: string, isMyCard: boolean) => {
  const pokemonPlacementTurn = useAtomValue(pokemonPlacementTurnAtom);
  const gameTurnCount = useAtomValue(gameTurnCountAtom);
  const myTurn = useAtomValue(myTurnAtom);
  const droppedCards = useAtomValue(droppedCardsAtom);
  
  // 진화 가능 조건:
  // 1. 해당 위치에 카드가 있어야 함
  // 2. 카드가 배치된 후 최소 1턴이 지나야 함
  // 3. 현재 턴이 카드 소유자의 턴이어야 함
  return droppedCards[cardId] && 
         (gameTurnCount - (pokemonPlacementTurn[cardId] || 0) >= 1) && 
         (isMyCard === myTurn);
};