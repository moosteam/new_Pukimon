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
  "card/레오꼬.png": {
    name: "레오꼬",
    isEx: false,
    type: "불",
    hp: 70,
    skill: [
      {
        name: "박치기",
        damage: 20,
        energy: 2,
      },
    ],
    weakness: "물",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 2
  },
  "card/꼬마돌.png": {
    name: "꼬마돌",
    isEx: false,
    type: "격투",
    hp: 70,
    skill: [
      {
        name: "몸통박치기",
        damage: 10,
        energy: 1,
      },
    ],
    weakness: "풀",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 2
  },
  "card/데기라스.png": {
    name: "데기라스",
    isEx: false,
    type: "격투",
    hp: 80,
    skill: [
      {
        name: "보복",
        damage: 30,
        energy: 2,
      },
    ],
    weakness: "풀",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 1
  },
  "card/애버라스.png": {
    name: "애버라스",
    isEx: false,
    type: "격투",
    hp: 70,
    skill: [
      {
        name: "야금야금",
        damage: 30,
        energy: 2,
      },
    ],
    weakness: "풀",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 2
  },
  "card/코뿌리.png": {
    name: "코뿌리",
    isEx: false,
    type: "격투",
    hp: 110,
    skill: [
      {
        name: "암석떨구기",
        damage: 80,
        energy: 3,
      },
    ],
    weakness: "풀",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 4
  },
  "card/꼬지모.png": {
    name: "꼬지모",
    isEx: false,
    type: "격투",
    hp: 110,
    skill: [
      {
        name: "세게되돌리기",
        damage: 20,
        energy: 1,
      },
    ],
    weakness: "풀",
    beforeEvo: "",
    afterEvo: "",
    retreatCost: 2
  },
};
