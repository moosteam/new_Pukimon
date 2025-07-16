interface Card {
  name: string;
  isEx: boolean;
  type: string;
  hp: number;
  skill: { name: string; damage: number; energy: number; }[];
  weakness: string;
  beforeEvo: string;
  afterEvo: string;
  retreatCost: number;
}

interface CardData {
  [key: string]: Card;
}

export const data: CardData = {
  "card/리자몽ex.png": {
    name: "리자몽ex",
    isEx: true,
    type: "불",
    hp: 180,
    skill: [
      {
        name: "베어가르기",
        damage: 60,
        energy: 3,
      },
      {
        name: "홍련의바람",
        damage: 200,
        energy: 4,
      },
    ],
    weakness: "물",
    beforeEvo: "card/리자드.png",
    afterEvo: "",
    retreatCost:2
  },
  "card/리자드.png": {
    name: "리자드",
    isEx: false,
    type: "불",
    hp: 90,
    skill: [
      {
        name: "불꽃의발톱",
        damage: 60,
        energy: 3,
      },
    ],
    weakness: "물",
    beforeEvo: "card/파이리.png",
    afterEvo: "card/리자몽ex.png",
    retreatCost:1
  },
  "card/파이리.png": {
    name: "파이리",
    isEx: false,
    type: "불",
    hp: 60,
    skill: [
      {
        name: "불꽃세례",
        damage: 30,
        energy: 1,
      },
    ],
    weakness: "물",
    beforeEvo: "",
    afterEvo: "card/리자드.png",
    retreatCost:1
  },
};
