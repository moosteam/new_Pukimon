import { DragEndEvent } from '@dnd-kit/core';
import { data } from '../data/cards';
import { useAtom, useAtomValue } from 'jotai';
import { 
  myTurnAtom, 
  myHandListAtom, 
  enemyHandListAtom,
  myBattlePokemonEnergyAtom,
  myBattlePokemonHPAtom,
  enemyBattlePokemonEnergyAtom,
  enemyBattlePokemonHPAtom,
  myWaitingPokemonHPAtom,
  myWaitingPokemonEnergyAtom,
  enemyWaitingPokemonHPAtom,
  enemyWaitingPokemonEnergyAtom,
  isNowTurnGiveEnergyAtom,
  droppedCardsAtom,
  pokemonPlacementTurnAtom,
  gameTurnCountAtom,
} from '../atom';
import { useEffect } from 'react';

/**
 * 카드 드래그 앤 드롭 핸들러 훅
 * 카드 이동, 에너지 추가, 진화 등의 동작을 처리합니다.
 */
export function useDragHandlers() {
  const myTurn = useAtomValue(myTurnAtom);
  
  // 상태 관리 - jotai atom 사용
  const [myHandList, setMyHandList] = useAtom(myHandListAtom);
  const [enemyHandList, setEnemyHandList] = useAtom(enemyHandListAtom);
  const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
  const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
  const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
  const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
  const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingPokemonHPAtom);
  const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom);
  const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom);
  const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom);
  const [isNowTurnGiveEnergy, setIsNowTurnGiveEnergy] = useAtom(isNowTurnGiveEnergyAtom);
  const [droppedCards, setDroppedCards] = useAtom(droppedCardsAtom);
  const [pokemonPlacementTurn, setPokemonPlacementTurn] = useAtom(pokemonPlacementTurnAtom);
  const gameTurnCount = useAtomValue(gameTurnCountAtom);
  
  /**
   * 드래그 종료 시 카드 배치 처리
   * 카드나 에너지를 드래그하여 필드에 배치할 때 호출됩니다.
   */
  function handleCardPlacement(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const cardName = active.data.current?.imgLink as string;
    const dropzoneId = over.id as string;
    const isMyCard = cardId.startsWith('card-');
    const isEnemyCard = cardId.startsWith('enemycard-');

    // 에너지 카드 처리
    if (cardId === "energy") {
      handleEnergyPlacement(dropzoneId);
      return;
    }

    // 턴 및 카드 소유권 검증
    if ((myTurn && !isMyCard) || (!myTurn && !isEnemyCard)) return;

    // 내 턴일 때는 상대방 영역에 카드를 배치할 수 없음
    if (myTurn && (dropzoneId === 'enemy_battle' || dropzoneId.startsWith('enemy_waiting_'))) {
      alert("내 턴에는 상대방 영역에 카드를 배치할 수 없습니다!");
      return;
    }

    if (!myTurn && (dropzoneId === 'my_battle' || dropzoneId.startsWith('my_waiting_'))) {
      alert("내 턴에는 상대방 영역에 카드를 배치할 수 없습니다!");
      return;
    }

    // 카드 인덱스 추출
    const index = parseInt(cardId.split('-')[1]);

    // 이미 카드가 있는 위치에 드롭한 경우 (진화 처리)
    if (droppedCards[dropzoneId]) {
      handlePokemonEvolution(dropzoneId, cardName, index);
      return;
    }
    // 빈 위치에 드롭한 경우 (기본 포켓몬 배치)
    else {
      // 진화체가 없는 카드만 배치 가능
      if (data[cardName]?.beforeEvo !== "") {
        return;
      }
      
      // 전투 영역 배치
      if (dropzoneId === 'my_battle' || dropzoneId === 'enemy_battle') {
        placePokemonInBattleArea(dropzoneId, cardName, index);
      }
      // 대기 영역 배치
      else if (dropzoneId.includes('waiting_')) {
        placePokemonInWaitingArea(dropzoneId, cardName, index);
      }
    }
  }

  /**
   * 에너지 카드 배치 처리
   * 에너지 카드를 포켓몬에게 부여합니다.
   */
  function handleEnergyPlacement(dropzoneId: string) {
    // 내 턴일 때는 상대방 포켓몬에 에너지를 붙일 수 없음
    if (myTurn && (dropzoneId === 'enemy_battle' || dropzoneId.includes('enemy_waiting_'))) {
      alert("내 턴에는 상대방 포켓몬에 에너지를 붙일 수 없습니다!");
      return;
    }
    
    // 상대 턴일 때는 내 포켓몬에 에너지를 붙일 수 없음
    if (!myTurn && (dropzoneId === 'my_battle' || dropzoneId.includes('my_waiting_'))) {
      alert("상대 턴에는 내 포켓몬에 에너지를 붙일 수 없습니다!");
      return;
    }
    
    setIsNowTurnGiveEnergy(true);
    
    // 전투 영역 에너지 추가
    if (dropzoneId === 'my_battle') {
      setMyBattlePokemonEnergy(prev => prev + 1);
    }
    else if (dropzoneId === 'enemy_battle') {
      setEnemyBattlePokemonEnergy(prev => prev + 1);
    }
    // 대기 영역 에너지 추가
    else if (dropzoneId.includes('enemy_waiting_')) {
      addEnergyToWaitingPokemon(dropzoneId, 'enemy');
    }
    else if (dropzoneId.includes('my_waiting_')) {
      addEnergyToWaitingPokemon(dropzoneId, 'my');
    }
  }

  /**
   * 대기 영역 포켓몬에 에너지 추가
   * 지정된 대기 위치의 포켓몬에 에너지를 추가합니다.
   */
  function addEnergyToWaitingPokemon(dropzoneId: string, owner: 'my' | 'enemy') {
    // 대기 위치 번호 추출 (1, 2, 3)
    const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
    
    // 해당 위치에 포켓몬이 있는지 확인
    if (droppedCards[dropzoneId]) {
      if (owner === 'enemy') {
        // 적 대기 포켓몬 에너지 업데이트
        const newEnergy = [...enemyWaitingEnergy];
        newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
        setEnemyWaitingEnergy(newEnergy);
      } else {
        // 내 대기 포켓몬 에너지 업데이트
        const newEnergy = [...myWaitingEnergy];
        newEnergy[waitingPosition] = newEnergy[waitingPosition] + 1;
        setMyWaitingEnergy(newEnergy);
      }
    }
  }

  /**
   * 포켓몬 진화 가능 여부 확인
   * 진화 가능 조건을 검사합니다.
   */
  function canEvolvePokemon(dropzoneId: string, cardName: string): boolean {
    // 진화 가능 여부 확인
    if (droppedCards[dropzoneId] !== data[cardName]?.beforeEvo) {
      console.log("진화체가 아님");
      return false;
    }
    
    // 배치된 턴 확인
    const placementTurn = pokemonPlacementTurn[dropzoneId] || 0;
    
    // 최소 1턴이 지났는지 확인 (현재 턴 - 배치 턴 >= 1)
    if (gameTurnCount - placementTurn < 1) {
      return false;
    }
    
    return true;
  }

  /**
   * 포켓몬 진화 처리
   * 이미 배치된 포켓몬을 진화시킵니다.
   * 포켓몬은 배치 후 최소 1턴이 지나야 진화할 수 있습니다.
   */
  function handlePokemonEvolution(dropzoneId: string, cardName: string, index: number) {
    console.log("이미 카드가 드롭됨 : " + droppedCards[dropzoneId]);
    
    // 진화 가능 여부 확인
    if (!canEvolvePokemon(dropzoneId, cardName)) {
      if (droppedCards[dropzoneId] !== data[cardName]?.beforeEvo) {
        alert("이 카드는 현재 포켓몬의 진화 형태가 아닙니다!");
      } else {
        alert("포켓몬은 필드에 나온 후 한 턴이 지나야 진화할 수 있습니다!");
      }
      return;
    }
    
    // 진화 사운드 이펙트 재생
    const evolutionSound = new Audio('/soundeffect/evolution.mp3');
    evolutionSound.volume = 0.5;
    evolutionSound.play().catch(error => {
      console.log('진화 사운드 재생 실패:', error);
    });
    
    // 카드 업데이트
    setDroppedCards({...droppedCards, [dropzoneId]: cardName });
    
    // 진화한 포켓몬의 배치 턴을 현재 턴으로 업데이트
    setPokemonPlacementTurn(prev => ({
      ...prev,
      [dropzoneId]: gameTurnCount
    }));
    
    // 진화 시 HP 업데이트
    if (dropzoneId === 'my_battle') {
      // 내 전투 포켓몬 진화
      setMyBattlePokemonHP(data[cardName].hp);
      setMyHandList(prev => prev.filter((_, i) => i !== index));
    } 
    else if (dropzoneId === 'enemy_battle') {
      // 적 전투 포켓몬 진화
      setEnemyBattlePokemonHP(data[cardName].hp);
      setEnemyHandList(prev => prev.filter((_, i) => i !== index));
    }
    else if (dropzoneId.includes('waiting_')) {
      // 대기 영역 포켓몬 진화
      updateWaitingPokemonAfterEvolution(dropzoneId, cardName, index);
    }
  }

  /**
   * 대기 영역 포켓몬 진화 후 상태 업데이트
   * 진화한 대기 포켓몬의 체력을 업데이트합니다.
   */
  function updateWaitingPokemonAfterEvolution(dropzoneId: string, cardName: string, index: number) {
    const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
    
    if (dropzoneId.startsWith('enemy_')) {
      // 적 대기 포켓몬 진화
      const newHP = [...enemyWaitingHP];
      newHP[waitingPosition] = data[cardName].hp;
      setEnemyWaitingHP(newHP);
      setEnemyHandList(prev => prev.filter((_, i) => i !== index));
    } else {
      // 내 대기 포켓몬 진화
      const newHP = [...myWaitingHP];
      newHP[waitingPosition] = data[cardName].hp;
      setMyWaitingHP(newHP);
      setMyHandList(prev => prev.filter((_, i) => i !== index));
    }
  }

  /**
   * 전투 영역에 포켓몬 배치
   * 새 포켓몬을 전투 영역에 배치합니다.
   */
  function placePokemonInBattleArea(dropzoneId: string, cardName: string, index: number) {
    // Card-Draw 사운드 재생
    const cardDrawSound = new Audio('/soundeffect/Card-Drow.mp3');
    cardDrawSound.volume = 1;
    cardDrawSound.play().catch(error => {
      console.log('Card-Draw 사운드 재생 실패:', error);
    });
    
    setDroppedCards(({...droppedCards, [dropzoneId]: cardName }));
    
    // 포켓몬 배치 턴 기록
    setPokemonPlacementTurn(prev => ({
      ...prev,
      [dropzoneId]: gameTurnCount
    }));
    
    if (myTurn) {
      // 내 전투 포켓몬 설정
      setMyBattlePokemonHP(data[cardName].hp);
      setMyHandList(prev => prev.filter((_, i) => i !== index));
    } else {
      // 적 전투 포켓몬 설정
      setEnemyBattlePokemonHP(data[cardName].hp);
      setEnemyHandList(prev => prev.filter((_, i) => i !== index));
    }
  }

  /**
   * 대기 영역에 포켓몬 배치
   * 새 포켓몬을 대기 영역에 배치합니다.
   */
  function placePokemonInWaitingArea(dropzoneId: string, cardName: string, index: number) {
    // 전투 영역에 포켓몬이 있는지 확인
    const battleArea = dropzoneId.startsWith('enemy_') ? 'enemy_battle' : 'my_battle';
    if (droppedCards[battleArea]) {
      // Card-Draw 사운드 재생
      const cardDrawSound = new Audio('/soundeffect/Card-Drow.mp3');
      cardDrawSound.volume = 0.8;
      cardDrawSound.play().catch(error => {
        console.log('Card-Draw 사운드 재생 실패:', error);
      });
      
      setDroppedCards({ ...droppedCards, [dropzoneId]: cardName });
      
      // 포켓몬 배치 턴 기록
      setPokemonPlacementTurn(prev => ({
        ...prev,
        [dropzoneId]: gameTurnCount
      }));
      
      // 대기 위치 번호 추출 (1, 2, 3)
      const waitingPosition = parseInt(dropzoneId.split('_').pop() || '1') - 1;
      
      // 카드 데이터에서 최대 체력 가져오기
      const maxHP = data[cardName].hp;
      
      if (dropzoneId.startsWith('enemy_')) {
        // 적 대기 포켓몬 설정
        updateEnemyWaitingPokemon(waitingPosition, maxHP, index);
      } else {
        // 내 대기 포켓몬 설정
        updateMyWaitingPokemon(waitingPosition, maxHP, index);
      }
    }
  }

  /**
   * 내 대기 포켓몬 상태 업데이트
   * 새로 배치된 내 대기 포켓몬의 체력과 에너지를 설정합니다.
   */
  // 권장 해결책
  
  useEffect(() => {
    console.log("myWaitingHP 업데이트됨:", myWaitingHP);
  }, [myWaitingHP]);
  
  function updateMyWaitingPokemon(waitingPosition: number, maxHP: number, index: number) {
    // 체력 설정 - 함수형 업데이트 사용
    setMyWaitingHP(prevHP => {
      const newHP = [...prevHP];
      newHP[waitingPosition] = maxHP;
      console.log("업데이트될 myWaitingHP:", newHP);
      return newHP;
    });
    
    // 에너지 초기화 - 함수형 업데이트 사용
    setMyWaitingEnergy(prevEnergy => {
      const newEnergy = [...prevEnergy];
      newEnergy[waitingPosition] = 0;
      return newEnergy;
    });
    
    // 손에서 카드 제거
    setMyHandList(prev => prev.filter((_, i) => i !== index));
  }

  /**
   * 적 대기 포켓몬 상태 업데이트
   * 새로 배치된 적 대기 포켓몬의 체력과 에너지를 설정합니다.
   */
  function updateEnemyWaitingPokemon(waitingPosition: number, maxHP: number, index: number) {
    // 체력 설정
    const newHP = [...enemyWaitingHP];
    newHP[waitingPosition] = maxHP;
    setEnemyWaitingHP(newHP);
    
    // 에너지 초기화
    const newEnergy = [...enemyWaitingEnergy];
    newEnergy[waitingPosition] = 0;
    setEnemyWaitingEnergy(newEnergy);
    
    // 손에서 카드 제거
    setEnemyHandList(prev => prev.filter((_, i) => i !== index));
  }

  return { handleDragEnd: handleCardPlacement };
}