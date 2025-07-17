'use client'

import { useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { 
  droppedCardsAtom,
  myBattlePokemonHPAtom,
  enemyBattlePokemonHPAtom,
  myHandListAtom,
  enemyHandListAtom,
  myTurnAtom,
  pokemonPlacementTurnAtom,
  gameTurnCountAtom,
  myWaitingPokemonHPAtom,
  myWaitingPokemonEnergyAtom,
  enemyWaitingPokemonHPAtom,
  enemyWaitingPokemonEnergyAtom
} from '../atom'
import { data } from '../data/cards'

// 푸키몬 이름과 카드 경로 매핑
const pukimonToCardMap: Record<string, string> = {
  'komadol': 'card/꼬마돌.png',
  'reoko': 'card/레오꼬.png',
  'degiras': 'card/데기라스.png',
  'averas': 'card/애버라스.png',
  'kopuri': 'card/코뿌리.png',
  'kojimo': 'card/꼬지모.png',
  // 나중에 추가할 포켓몬들
  'pikachu': 'card/피카츄.png',
  'charizard': 'card/리자몽ex.png',
  'charmander': 'card/파이리.png',
  'charmeleon': 'card/리자드.png'
}

export function usePukimonToBattlefield() {
  const [droppedCards, setDroppedCards] = useAtom(droppedCardsAtom)
  const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom)
  const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom)
  const [myHandList, setMyHandList] = useAtom(myHandListAtom)
  const [enemyHandList, setEnemyHandList] = useAtom(enemyHandListAtom)
  const myTurn = useAtomValue(myTurnAtom)
  const [pokemonPlacementTurn, setPokemonPlacementTurn] = useAtom(pokemonPlacementTurnAtom)
  const gameTurnCount = useAtomValue(gameTurnCountAtom)
  const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingPokemonHPAtom)
  const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom)
  const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom)
  const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom)

  useEffect(() => {
    console.log('usePukimonToBattlefield 훅이 초기화됨')
    
    // 배틀필드 전용 이벤트 핸들러
    const handleBattlePukimonDetected = (event: CustomEvent) => {
      const { puki, type } = event.detail
      console.log('배틀필드 배치를 위한 Pukimon 감지:', {
        puki,
        type,
        myTurn,
        currentDroppedCards: droppedCards,
        gameTurnCount
      })
      
      processPukimonPlacement(puki, 'battle')
    }

    // 벤치 전용 이벤트 핸들러
    const handleBenchPukimonDetected = (event: CustomEvent) => {
      const { puki, type, benchNumber } = event.detail
      console.log('벤치 배치를 위한 Pukimon 감지:', {
        puki,
        type,
        benchNumber,
        myTurn,
        currentDroppedCards: droppedCards,
        gameTurnCount
      })
      
      processPukimonPlacement(puki, 'bench', benchNumber)
    }

    // 공통 처리 함수
    const processPukimonPlacement = (puki: string, targetArea: 'battle' | 'bench', benchNumber?: number) => {
      
      // 매핑된 카드 경로 찾기
      const cardPath = pukimonToCardMap[puki]
      if (!cardPath) {
        console.log('아직 지원하지 않는 Pukimon:', puki, '매핑 가능한 목록:', Object.keys(pukimonToCardMap))
        return
      }

      // 카드 데이터 확인
      const cardData = data[cardPath]
      if (!cardData) {
        console.error('카드 데이터를 찾을 수 없음:', cardPath, '사용 가능한 카드:', Object.keys(data))
        return
      }

      console.log('카드 매핑 성공:', { puki, cardPath, cardName: cardData.name, targetArea })

      // targetArea에 따라 배치 로직 결정
      if (targetArea === 'battle') {
        // 배틀필드 강제 배치
        if (myTurn) {
          if (!droppedCards['my_battle']) {
            console.log('내 배틀필드에 강제 배치:', cardData.name)
            placeCardOnBattlefield('my_battle', cardPath, cardData, true)
          } else {
            console.log('내 배틀필드에 이미 포켓몬이 있어 배치 불가:', droppedCards['my_battle'])
          }
        } else {
          if (!droppedCards['enemy_battle']) {
            console.log('상대 배틀필드에 강제 배치:', cardData.name)
            placeCardOnBattlefield('enemy_battle', cardPath, cardData, false)
          } else {
            console.log('상대 배틀필드에 이미 포켓몬이 있어 배치 불가:', droppedCards['enemy_battle'])
          }
        }
      } else {
        // 벤치 강제 배치 (특정 번호 지정)
        if (myTurn) {
          placePokemonInWaitingArea('my', cardPath, cardData, benchNumber)
        } else {
          placePokemonInWaitingArea('enemy', cardPath, cardData, benchNumber)
        }
      }
    }

    // 카드를 손에 추가하고 배틀필드에 배치하는 함수
    const placeCardOnBattlefield = (
      battleArea: string, 
      cardPath: string, 
      cardData: any, 
      isMyCard: boolean
    ) => {
      console.log(`${cardData.name} 카드를 손에 추가하고 배틀필드에 배치 시작`)
      
      // 1단계: 먼저 카드를 손에 추가
      if (isMyCard) {
        // 내 손에 카드가 있는지 확인
        const cardInHand = myHandList.findIndex(card => card === cardPath)
        if (cardInHand === -1) {
          // 손에 없으면 추가
          setMyHandList(prev => [...prev, cardPath])
          console.log(`${cardData.name}을 내 손에 추가했습니다`)
          
          // 카드 추가 효과음 재생
          const cardAddSound = new Audio('/SoundEffect/Card-Drow.mp3')
          cardAddSound.volume = 0.5
          cardAddSound.play().catch(error => {
            console.log('카드 추가 사운드 재생 실패:', error)
          })
        }
      } else {
        // 상대 손에 카드가 있는지 확인
        const cardInHand = enemyHandList.findIndex(card => card === cardPath)
        if (cardInHand === -1) {
          // 손에 없으면 추가
          setEnemyHandList(prev => [...prev, cardPath])
          console.log(`${cardData.name}을 상대 손에 추가했습니다`)
          
          // 카드 추가 효과음 재생
          const cardAddSound = new Audio('/SoundEffect/Card-Drow.mp3')
          cardAddSound.volume = 0.5
          cardAddSound.play().catch(error => {
            console.log('카드 추가 사운드 재생 실패:', error)
          })
        }
      }

      // 2단계: 잠시 후 카드를 배틀필드에 배치 (손에서 꺼내는 효과)
      setTimeout(() => {
        console.log(`${cardData.name}을 손에서 배틀필드로 이동 시작`)
        
        // Card-Draw 사운드 재생 (배치용)
        const cardPlaceSound = new Audio('/SoundEffect/Card-Drow.mp3')
        cardPlaceSound.volume = 0.8
        cardPlaceSound.play().catch(error => {
          console.log('Card-Draw 사운드 재생 실패:', error)
        })

        // 카드 배치
        setDroppedCards(prev => ({
          ...prev,
          [battleArea]: cardPath
        }))

        // 포켓몬 배치 턴 기록
        setPokemonPlacementTurn(prev => ({
          ...prev,
          [battleArea]: gameTurnCount
        }))

        // HP 설정 및 손에서 카드 제거
        if (isMyCard) {
          setMyBattlePokemonHP(cardData.hp)
          setMyHandList(prev => {
            const index = prev.findIndex(card => card === cardPath)
            if (index !== -1) {
              return prev.filter((_, i) => i !== index)
            }
            return prev
          })
        } else {
          setEnemyBattlePokemonHP(cardData.hp)
          setEnemyHandList(prev => {
            const index = prev.findIndex(card => card === cardPath)
            if (index !== -1) {
              return prev.filter((_, i) => i !== index)
            }
            return prev
          })
        }

        console.log(`${cardData.name}을(를) ${battleArea}에 배치 완료!`)
      }, 2000) // 2초 후에 배치 (사용자가 카드를 확인할 시간)
    }

    // 벤치(대기 영역)에 포켓몬 배치하는 함수
    const placePokemonInWaitingArea = (
      playerType: 'my' | 'enemy',
      cardPath: string,
      cardData: any,
      specificBenchNumber?: number
    ) => {
      // 배틀필드에 포켓몬이 있는지 확인
      const battleArea = playerType === 'my' ? 'my_battle' : 'enemy_battle'
      if (!droppedCards[battleArea]) {
        console.log('배틀필드에 포켓몬이 없어서 벤치에 배치할 수 없습니다!')
        return
      }

      // 빈 벤치 자리 찾기 또는 특정 번호 사용
      let emptyWaitingSlot = null
      
      if (specificBenchNumber) {
        // 특정 벤치 번호가 지정된 경우
        const waitingId = `${playerType}_waiting_${specificBenchNumber}`
        if (!droppedCards[waitingId]) {
          emptyWaitingSlot = waitingId
        } else {
          console.log(`벤치 ${specificBenchNumber}번에 이미 포켓몬이 있습니다!`)
          return
        }
      } else {
        // 빈 자리 자동 찾기
        for (let i = 1; i <= 3; i++) {
          const waitingId = `${playerType}_waiting_${i}`
          if (!droppedCards[waitingId]) {
            emptyWaitingSlot = waitingId
            break
          }
        }
      }

      if (!emptyWaitingSlot) {
        console.log('벤치가 가득 차서 더 이상 배치할 수 없습니다!')
        return
      }

      console.log(`${cardData.name} 카드를 벤치에 추가하고 배치 시작`)
      
      // 1단계: 먼저 카드를 손에 추가
      if (playerType === 'my') {
        const cardInHand = myHandList.findIndex(card => card === cardPath)
        if (cardInHand === -1) {
          setMyHandList(prev => [...prev, cardPath])
          console.log(`${cardData.name}을 내 손에 추가했습니다`)
          
          const cardAddSound = new Audio('/SoundEffect/Card-Drow.mp3')
          cardAddSound.volume = 0.5
          cardAddSound.play().catch(error => {
            console.log('카드 추가 사운드 재생 실패:', error)
          })
        }
      } else {
        const cardInHand = enemyHandList.findIndex(card => card === cardPath)
        if (cardInHand === -1) {
          setEnemyHandList(prev => [...prev, cardPath])
          console.log(`${cardData.name}을 상대 손에 추가했습니다`)
          
          const cardAddSound = new Audio('/SoundEffect/Card-Drow.mp3')
          cardAddSound.volume = 0.5
          cardAddSound.play().catch(error => {
            console.log('카드 추가 사운드 재생 실패:', error)
          })
        }
      }

      // 2단계: 잠시 후 벤치에 배치
      setTimeout(() => {
        console.log(`${cardData.name}을 손에서 벤치로 이동 시작`)
        
        const cardPlaceSound = new Audio('/SoundEffect/Card-Drow.mp3')
        cardPlaceSound.volume = 0.8
        cardPlaceSound.play().catch(error => {
          console.log('Card-Draw 사운드 재생 실패:', error)
        })

        // 벤치에 카드 배치
        setDroppedCards(prev => ({
          ...prev,
          [emptyWaitingSlot]: cardPath
        }))

        // 포켓몬 배치 턴 기록
        setPokemonPlacementTurn(prev => ({
          ...prev,
          [emptyWaitingSlot]: gameTurnCount
        }))

        // 벤치 위치 인덱스 (0, 1, 2)
        const waitingPosition = parseInt(emptyWaitingSlot.split('_').pop() || '1') - 1

        // HP 설정 및 손에서 카드 제거
        if (playerType === 'my') {
          const newHP = [...myWaitingHP]
          newHP[waitingPosition] = cardData.hp
          setMyWaitingHP(newHP)
          
          setMyHandList(prev => {
            const index = prev.findIndex(card => card === cardPath)
            if (index !== -1) {
              return prev.filter((_, i) => i !== index)
            }
            return prev
          })
        } else {
          const newHP = [...enemyWaitingHP]
          newHP[waitingPosition] = cardData.hp
          setEnemyWaitingHP(newHP)
          
          setEnemyHandList(prev => {
            const index = prev.findIndex(card => card === cardPath)
            if (index !== -1) {
              return prev.filter((_, i) => i !== index)
            }
            return prev
          })
        }

        console.log(`${cardData.name}을(를) ${emptyWaitingSlot}에 배치 완료!`)
      }, 2000) // 2초 후에 배치
    }

    // 이벤트 리스너 등록
    window.addEventListener('battlePukimonDetected', handleBattlePukimonDetected as EventListener)
    window.addEventListener('benchPukimonDetected', handleBenchPukimonDetected as EventListener)
    
    return () => {
      window.removeEventListener('battlePukimonDetected', handleBattlePukimonDetected as EventListener)
      window.removeEventListener('benchPukimonDetected', handleBenchPukimonDetected as EventListener)
    }
  }, [droppedCards, myTurn, gameTurnCount, setDroppedCards, setMyBattlePokemonHP, 
      setEnemyBattlePokemonHP, setMyHandList, setEnemyHandList, setPokemonPlacementTurn])
} 