import { useState, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { 
    myBattlePokemonEnergyAtom, 
    myBattlePokemonHPAtom, 
    enemyBattlePokemonEnergyAtom, 
    enemyBattlePokemonHPAtom,
    myWaitingPokemonEnergyAtom,
    myWaitingPokemonHPAtom,
    enemyWaitingPokemonEnergyAtom,
    enemyWaitingPokemonHPAtom,
    myGameScoreAtom,
    enemyGameScoreAtom,
    myTurnAtom,
    droppedCardsAtom
} from "../atom";

interface UseFieldCardsProps {
    onEndTurn: () => void;
}

/**
 * 필드 카드 관리 훅
 * 전투 및 대기 영역의 포켓몬 상태를 관리하고 공격/후퇴 등의 액션을 처리합니다.
 */
export const useFieldCards = ({
    onEndTurn
}: UseFieldCardsProps) => {
    // 기본 상태 관리
    const myTurn = useAtomValue(myTurnAtom);
    const [myBattlePokemonEnergy, setMyBattlePokemonEnergy] = useAtom(myBattlePokemonEnergyAtom);
    const [myBattlePokemonHP, setMyBattlePokemonHP] = useAtom(myBattlePokemonHPAtom);
    const [enemyBattlePokemonEnergy, setEnemyBattlePokemonEnergy] = useAtom(enemyBattlePokemonEnergyAtom);
    const [enemyBattlePokemonHP, setEnemyBattlePokemonHP] = useAtom(enemyBattlePokemonHPAtom);
    const [droppedCards, setDroppedCards] = useAtom(droppedCardsAtom);

    // 대기 영역 포켓몬 상태 관리
    const [myWaitingEnergy, setMyWaitingEnergy] = useAtom(myWaitingPokemonEnergyAtom);
    const [myWaitingHP, setMyWaitingHP] = useAtom(myWaitingPokemonHPAtom);
    const [enemyWaitingEnergy, setEnemyWaitingEnergy] = useAtom(enemyWaitingPokemonEnergyAtom);
    const [enemyWaitingHP, setEnemyWaitingHP] = useAtom(enemyWaitingPokemonHPAtom);
    
    // 게임 점수 관리
    const [myGameScore, setMyGameScore] = useAtom(myGameScoreAtom);
    const [enemyGameScore, setEnemyGameScore] = useAtom(enemyGameScoreAtom);
    
    // 공격 관련 상태 관리
    const [isReadyToAttack, setIsReadyToAttack] = useState(false);
    const [attackingCard, setAttackingCard] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [isMyAttack, setIsMyAttack] = useState(false);
    const [isEnemyAttack, setIsEnemyAttack] = useState(false);

    // 점수 애니메이션 상태 관리
    const [showScoreAnimation, setShowScoreAnimation] = useState(false);
    const [scoreAnimationType, setScoreAnimationType] = useState<'my' | 'enemy' | null>(null);

    // 게임 엔딩 상태 관리
    const [showGameEnd, setShowGameEnd] = useState(false);

    // 게임 종료 체크
    useEffect(() => {
        if (myGameScore >= 3 || enemyGameScore >= 3) {
            setShowGameEnd(true);
        }
    }, [myGameScore, enemyGameScore]);

    // showGameEnd가 true가 되면 gameOver도 true로 설정
    useEffect(() => {
        if (showGameEnd) setGameOver(true);
    }, [showGameEnd]);

    /**
     * 첫 번째 벤치 포켓몬 찾기
     * 지정된 플레이어의 대기 영역에서 첫 번째로 발견되는 포켓몬의 인덱스를 반환합니다.
     */
    const findFirstBenchPokemon = (prefix: 'my' | 'enemy'): number | null => {
        for (let i = 1; i <= 3; i++) {
            if (droppedCards[`${prefix}_waiting_${i}`]) {
                return i;
            }
        }
        return null;
    };

    /**
     * 벤치 포켓몬 위치 이동
     * 포켓몬이 전투 영역으로 이동한 후 벤치의 포켓몬들을 앞으로 당깁니다.
     */
    const shiftBenchPokemon = (updatedCards: Record<string, string>, prefix: 'my' | 'enemy', startIndex: number) => {
        for (let i = startIndex; i < 3; i++) {
            if (updatedCards[`${prefix}_waiting_${i+1}`]) {
                updatedCards[`${prefix}_waiting_${i}`] = updatedCards[`${prefix}_waiting_${i+1}`];
                delete updatedCards[`${prefix}_waiting_${i+1}`];
            } else {
                delete updatedCards[`${prefix}_waiting_${i}`];
                break;
            }
        }
        return updatedCards;
    };

    /**
     * 스킬 사용 처리
     * 선택한 스킬을 사용하여 상대 포켓몬을 공격합니다.
     */
    const useSkill = (skill: any) => {
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        // 에너지 체크
        if (currentEnergy < skill.energy) {
            alert("스킬 사용에 필요한 에너지가 부족합니다!");
            setIsReadyToAttack(false);
            return;
        }
        
        // 공격 애니메이션 상태 설정
        setIsReadyToAttack(false);
        setIsMyAttack(myTurn);
        setIsEnemyAttack(!myTurn);
        
        // 공격 로직 처리 (애니메이션 시간 후)
        setTimeout(() => {
            processAttackDamage(skill);
        }, 3000);
    };

    /**
     * 공격 데미지 처리 및 결과 반영
     * 스킬 데미지를 적용하고 포켓몬 교체, 점수 계산 등을 처리합니다.
     */
    const processAttackDamage = (skill: any) => {
        // 내 포켓몬이 공격하는 경우
        if (attackingCard === 'my_battle') {
            // 적 포켓몬에 데미지 적용
            const newEnemyHP = enemyBattlePokemonHP - skill.damage;
            setEnemyBattlePokemonHP(newEnemyHP);
            
            // 적 포켓몬이 쓰러진 경우
            if (newEnemyHP <= 0) {
                // 공격 상태 즉시 초기화 (트로피컬 해머가 다시 나타나지 않도록)
                setIsMyAttack(false);
                setIsEnemyAttack(false);
                setAttackingCard(null);
                
                // 점수 애니메이션 시작
                setScoreAnimationType('my');
                setShowScoreAnimation(true);
                
                // 애니메이션 완료 후 로직 실행을 위해 여기서 종료
                return;
            }
        } 
        // 적 포켓몬이 공격하는 경우
        else {
            // 내 포켓몬에 데미지 적용
            const newMyHP = myBattlePokemonHP - skill.damage;
            setMyBattlePokemonHP(newMyHP);
            
            // 내 포켓몬이 쓰러진 경우
            if (newMyHP <= 0) {
                // 공격 상태 즉시 초기화 (트로피컬 해머가 다시 나타나지 않도록)
                setIsMyAttack(false);
                setIsEnemyAttack(false);
                setAttackingCard(null);
                
                // 점수 애니메이션 시작
                setScoreAnimationType('enemy');
                setShowScoreAnimation(true);
                
                // 애니메이션 완료 후 로직 실행을 위해 여기서 종료
                return;
            }
        }
        
        // 포켓몬이 죽지 않은 경우에만 턴 종료
        finishTurn();
    };

    /**
     * 점수 애니메이션 완료 후 실행되는 함수
     */
    const handleScoreAnimationComplete = () => {
        setShowScoreAnimation(false);
        setScoreAnimationType(null);
        
        // 포켓몬 사망 처리 로직 실행
        if (scoreAnimationType === 'my') {
            handleMyPokemonKill();
        } else if (scoreAnimationType === 'enemy') {
            handleEnemyPokemonKill();
        }
    };

    /**
     * 내 포켓몬이 적 포켓몬을 죽였을 때의 처리
     */
    const handleMyPokemonKill = () => {
        setMyGameScore(prev => prev + 1);
        const benchIndex = findFirstBenchPokemon('enemy');
        
        // 벤치에 교체할 포켓몬이 있는 경우
        if (benchIndex !== null) {
            // 벤치 포켓몬을 전투 영역으로 이동
            const updatedDroppedCards = {...droppedCards};
            const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
            const benchHP = enemyWaitingHP[benchIndex - 1];
            const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
            
            updatedDroppedCards['enemy_battle'] = benchPokemon;
            delete updatedDroppedCards[`enemy_waiting_${benchIndex}`];
            
            // 벤치 포켓몬 위치 조정
            const finalCards = shiftBenchPokemon(updatedDroppedCards, 'enemy', benchIndex);
            setDroppedCards(finalCards);
            
            // 새 전투 포켓몬 상태 설정
            setEnemyBattlePokemonHP(benchHP);
            setEnemyBattlePokemonEnergy(benchEnergy);
            
            // 대기 영역 상태 업데이트
            const newWaitingHP = [...enemyWaitingHP];
            const newWaitingEnergy = [...enemyWaitingEnergy];
            
            // 대기 영역 포켓몬 위치 조정
            for (let i = benchIndex - 1; i < 2; i++) {
                if (i + 1 < 3) {
                    newWaitingHP[i] = newWaitingHP[i + 1];
                    newWaitingEnergy[i] = newWaitingEnergy[i + 1];
                } else {
                    newWaitingHP[i] = 0;
                    newWaitingEnergy[i] = 0;
                }
            }
            
            setEnemyWaitingHP(newWaitingHP);
            setEnemyWaitingEnergy(newWaitingEnergy);
        } 
        // 교체할 포켓몬이 없는 경우
        else {
            delete droppedCards['enemy_battle'];
            setDroppedCards({...droppedCards});
            
            const newScore = myGameScore + 1;
            setMyGameScore(newScore);
            
            // 게임 종료는 useEffect에서 처리됨
        }
        
        onEndTurn();
    };

    /**
     * 적 포켓몬이 내 포켓몬을 죽였을 때의 처리
     */
    const handleEnemyPokemonKill = () => {
        setEnemyGameScore(prev => prev + 1);
        const benchIndex = findFirstBenchPokemon('my');
        
        // 벤치에 교체할 포켓몬이 있는 경우
        if (benchIndex !== null) {
            // 벤치 포켓몬을 전투 영역으로 이동
            const updatedDroppedCards = {...droppedCards};
            const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
            const benchHP = myWaitingHP[benchIndex - 1];
            const benchEnergy = myWaitingEnergy[benchIndex - 1];
            
            updatedDroppedCards['my_battle'] = benchPokemon;
            delete updatedDroppedCards[`my_waiting_${benchIndex}`];
            
            // 벤치 포켓몬 위치 조정
            const finalCards = shiftBenchPokemon(updatedDroppedCards, 'my', benchIndex);
            setDroppedCards(finalCards);
            
            // 새 전투 포켓몬 상태 설정
            setMyBattlePokemonHP(benchHP);
            setMyBattlePokemonEnergy(benchEnergy);
            
            // 대기 영역 상태 업데이트
            const newWaitingHP = [...myWaitingHP];
            const newWaitingEnergy = [...myWaitingEnergy];
            
            // 대기 영역 포켓몬 위치 조정
            for (let i = benchIndex - 1; i < 2; i++) {
                if (i + 1 < 3) {
                    newWaitingHP[i] = newWaitingHP[i + 1];
                    newWaitingEnergy[i] = newWaitingEnergy[i + 1];
                } else {
                    newWaitingHP[i] = 0;
                    newWaitingEnergy[i] = 0;
                }
            }
            
            setMyWaitingHP(newWaitingHP);
            setMyWaitingEnergy(newWaitingEnergy);
        } 
        // 교체할 포켓몬이 없는 경우
        else {
            delete droppedCards['my_battle'];
            setDroppedCards({...droppedCards});
            
            const newScore = enemyGameScore + 1;
            setEnemyGameScore(newScore);
            
            // 게임 종료는 useEffect에서 처리됨
        }
        
        onEndTurn();
    };

    /**
     * 턴 종료 처리
     */
    const finishTurn = () => {
        // 공격 상태 초기화 및 턴 종료
        setIsMyAttack(false);
        setIsEnemyAttack(false);
        setAttackingCard(null);
        onEndTurn();
    };

    /**
     * 포켓몬 후퇴 처리
     * 현재 전투 중인 포켓몬을 벤치의 포켓몬과 교체합니다.
     */
    const swapWithBenchPokemon = () => {
        const currentEnergy = attackingCard === 'my_battle' 
            ? myBattlePokemonEnergy 
            : enemyBattlePokemonEnergy;
        
        // 에너지 체크
        if (currentEnergy < 1) {
            alert("후퇴에 필요한 에너지가 부족합니다! 최소 1 에너지가 필요합니다.");
            setIsReadyToAttack(false);
            return;
        }
        
        // 교체할 벤치 포켓몬 찾기
        const prefix = attackingCard === 'my_battle' ? 'my' : 'enemy';
        const benchIndex = findFirstBenchPokemon(prefix);
        
        // 교체할 포켓몬이 없는 경우
        if (benchIndex === null) {
            alert("벤치에 교체할 포켓몬이 없습니다!");
            setIsReadyToAttack(false);
            return;
        }
        
        const updatedDroppedCards = {...droppedCards};
        
        // 내 포켓몬 교체
        if (attackingCard === 'my_battle') {
            // 현재 전투 포켓몬 정보 저장
            const battlePokemon = updatedDroppedCards['my_battle'];
            const battleHP = myBattlePokemonHP;
            const battleEnergy = myBattlePokemonEnergy - 1; // 후퇴 비용 차감
            
            // 벤치 포켓몬 정보 저장
            const benchPokemon = updatedDroppedCards[`my_waiting_${benchIndex}`];
            const benchHP = myWaitingHP[benchIndex - 1];
            const benchEnergy = myWaitingEnergy[benchIndex - 1];
            
            // 포켓몬 위치 교체
            updatedDroppedCards['my_battle'] = benchPokemon;
            updatedDroppedCards[`my_waiting_${benchIndex}`] = battlePokemon;
            
            // 전투 영역 상태 업데이트
            setMyBattlePokemonHP(benchHP);
            setMyBattlePokemonEnergy(benchEnergy);
            
            // 대기 영역 상태 업데이트
            const newWaitingHP = [...myWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setMyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...myWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setMyWaitingEnergy(newWaitingEnergy);
        } 
        // 적 포켓몬 교체
        else {
            // 현재 전투 포켓몬 정보 저장
            const battlePokemon = updatedDroppedCards['enemy_battle'];
            const battleHP = enemyBattlePokemonHP;
            const battleEnergy = enemyBattlePokemonEnergy - 1; // 후퇴 비용 차감
            
            // 벤치 포켓몬 정보 저장
            const benchPokemon = updatedDroppedCards[`enemy_waiting_${benchIndex}`];
            const benchHP = enemyWaitingHP[benchIndex - 1];
            const benchEnergy = enemyWaitingEnergy[benchIndex - 1];
            
            // 포켓몬 위치 교체
            updatedDroppedCards['enemy_battle'] = benchPokemon;
            updatedDroppedCards[`enemy_waiting_${benchIndex}`] = battlePokemon;
            
            // 전투 영역 상태 업데이트
            setEnemyBattlePokemonHP(benchHP);
            setEnemyBattlePokemonEnergy(benchEnergy);
            
            // 대기 영역 상태 업데이트
            const newWaitingHP = [...enemyWaitingHP];
            newWaitingHP[benchIndex - 1] = battleHP;
            setEnemyWaitingHP(newWaitingHP);
            
            const newWaitingEnergy = [...enemyWaitingEnergy];
            newWaitingEnergy[benchIndex - 1] = battleEnergy;
            setEnemyWaitingEnergy(newWaitingEnergy);
        }
        
        // 카드 상태 업데이트 및 턴 종료
        setDroppedCards(updatedDroppedCards);
        setIsReadyToAttack(false);
        onEndTurn();
    };

    return {
        isReadyToAttack,
        setIsReadyToAttack,
        attackingCard,
        setAttackingCard,
        gameOver,
        isMyAttack,
        isEnemyAttack,
        handleAttack: useSkill,           // 함수명 변경: handleAttack -> useSkill
        handleRetreat: swapWithBenchPokemon, // 함수명 변경: handleRetreat -> swapWithBenchPokemon
        myBattlePokemonEnergy,
        myBattlePokemonHP,
        enemyBattlePokemonEnergy,
        enemyBattlePokemonHP,
        myGameScore,
        enemyGameScore,
        // 점수 애니메이션 관련 상태 추가
        showScoreAnimation,
        scoreAnimationType,
        handleScoreAnimationComplete,
        showGameEnd
    };
};