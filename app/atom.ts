import { atom } from "jotai";

export const myBattleAtom = atom<string>("myBattle");
export const enemyBattleAtom = atom<string>("enemyBattle");

export const isNowTurnGiveEnergyAtom = atom<boolean>(true);

export const myCardListAtom = atom<string[]>([
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "리자드",
  "리자몽ex",
  "파이리",
  "리자드",
  "리자몽ex",
]);

export const enemyCardListAtom = atom<string[]>([
  "파이리",
  "파이리",
  "파이리",
  "파이리",
  "리자드",
  "리자몽ex",
  "파이리",
  "리자드",
  "리자몽ex",
]);

export const myCardRearAtom = atom<number>(0);

export const myHandListAtom = atom<string[]>([]);
export const enemyHandListAtom = atom<string[]>([]);
export const myUsedListAtom = atom<string[]>([]);
export const enemyUsedListAtom = atom<string[]>([]);

export const myBattlePokemonEnergyAtom = atom<number>(0);
export const myWaitingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const myBattlePokemonHPAtom = atom<number>(0);
export const myWaitingPokemonHPAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonEnergyAtom = atom<number>(0);
export const enemyWaitingPokemonEnergyAtom = atom<number[]>([0, 0, 0]);

export const enemyBattlePokemonHPAtom = atom<number>(0);
export const enemyWaitingPokemonHPAtom = atom<number[]>([0, 0, 0]);

// Add score atoms for tracking defeated Pokémon
export const myGameScoreAtom = atom<number>(0);
export const enemyGameScoreAtom = atom<number>(0);

export const isMyDrawCardAtom = atom<number>(0); // Add this atom to track the turn
export const isEnemyDrawCardAtom = atom<number>(0); // Add this atom to track the turn

export const myTurnAtom = atom<boolean>(true);

// Animation Sequence Atoms
export const boardRotateZAtom = atom(70);
export const boardScaleAtom = atom(0.5);
export const boardOpacityAtom = atom(100);
export const playerCardRotateAtom = atom(-30);
export const playerCardPositionAtom = atom(-130);
export const startVideoAtom = atom(false);
export const coinTextOpacityAtom = atom(0);
export const boardRotateXAtom = atom(0);
export const attackScaleAtom = atom(1);

// 드롭된 카드 상태 관리를 위한 atom
export const droppedCardsAtom = atom<{ [key: string]: string }>({});

// 포켓몬 배치 턴을 추적하는 atom
export const pokemonPlacementTurnAtom = atom<Record<string, number>>({});

// 현재 게임 턴 수를 추적하는 atom
export const gameTurnCountAtom = atom<number>(1);

export const showFullScreenEffectAtom = atom(false);
export const showScoreAnimationAtom = atom(false);
export const scoreAnimationPropsAtom = atom({
  isVisible: false,
  isMyScore: true,
  onAnimationComplete: () => {},
  profileImg: "/ui/player1.png",
  nickname: "포켓마스터"
});