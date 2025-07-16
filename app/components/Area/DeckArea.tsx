import React from "react";
import { EnergyCard } from "../Card/EnergyCard";
import { useAtomValue } from "jotai";
import { isEnemyDrawCardAtom, isMyDrawCardAtom, isNowTurnGiveEnergyAtom, myTurnAtom } from "../../atom";

// DeckArea 컴포넌트를 위한 Props 인터페이스
interface DeckAreaProps {
    isMyDeck: boolean;  // 이 덱이 플레이어의 것인지(true) 상대방의 것인지(false)
    onEndTurn: () => void;  // 턴 종료 버튼 클릭 시 호출될 함수
}

export const DeckArea: React.FC<DeckAreaProps> = ({
    isMyDeck,
    onEndTurn
}) => {
    const myTurn = useAtomValue(myTurnAtom);
    // 이번 턴에 에너지가 이미 부여되었는지 상태 가져오기
    const isNowTurnGiveEnergy = useAtomValue(isNowTurnGiveEnergyAtom);
    const isMyDrawCard = useAtomValue(isMyDrawCardAtom);
    const isEnemyDrawCard = useAtomValue(isEnemyDrawCardAtom);
    // "턴 종료하기" 버튼의 스타일:
    // - 플레이어 덱: 플레이어 턴일 때만 보임
    // - 상대방 덱: 상대방 턴일 때만 보이며 상하 반전됨
    const buttonStyle = isMyDeck
        ? { visibility: myTurn ? "visible" : "hidden" }
        : { visibility: !myTurn ? "visible" : "hidden", transform: 'scale(-1, -1)' };

    return (
        // 플레이어 덱일 경우에만 flex column 레이아웃을 가진 컨테이너 div
        <div>
            {/* 상대방 덱일 경우, 상대방 턴이고 에너지가 아직 부여되지 않았을 때만 에너지 카드 표시 */}
            {
                (!myTurn && !isMyDeck && !isNowTurnGiveEnergy) ?
                <EnergyCard isReversed={true} isVisible={!myTurn && !isMyDeck && !isNowTurnGiveEnergy} /> :
                <div className="w-18 h-18"></div>

            }
            {/* 덱의 뒷면 표시 */}
            {!isMyDeck
                ?
                <div className="relative">
                    <img src="ui/pukimon_card_back.png" alt="Card Back" className="w-18 relative" />
                    {Array.from({ length: isEnemyDrawCard }).map((_, index) => (
                        <img
                            key={index}
                            src="ui/pukimon_card_back.png"
                            alt="Card Back"
                            className={`
                                w-18 
                                absolute 
                                duration-300 
                                z-0 
                                deck-entry-animation-reverse
                            `}
                        />
                    ))}

                </div>
                :
                <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
            }
            <div>
                {/* 턴 종료 버튼 - 가시성은 buttonStyle로 제어 */}
                <button
                    onClick={onEndTurn}
                    className="bg-white text-black hover:bg-blue-100 text-sm mt-4 mb-4 font-bold py-2 px-2 rounded-full shadow-lg transition-all duration-300"
                    style={buttonStyle as React.CSSProperties}
                >
                    턴 종료하기
                </button>

                {/* 상대방 덱일 경우, 버림 더미 자리 표시 */}
            </div>
            {isMyDeck
                ?
                <div className="relative">
                    <img src="ui/pukimon_card_back.png" alt="Card Back" className="w-18 relative" />
                    {Array.from({ length: isMyDrawCard }).map((_, index) => (
                        <img
                            key={index}
                            src="ui/pukimon_card_back.png"
                            alt="Card Back"
                            className={`
                                w-18 
                                absolute 
                                duration-300 
                                z-0 
                                deck-entry-animation 
                            `}
                        />
                    ))}

                </div>
                :
                <div className="w-18 h-25 rounded-sm bg-black/10 shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]"></div>
            }
            {/* 플레이어 덱일 경우, 버림 더미 자리와 에너지 카드 표시 */}
            {
                (myTurn && isMyDeck && !isNowTurnGiveEnergy) ?
                <EnergyCard isReversed={false} isVisible={myTurn && isMyDeck && !isNowTurnGiveEnergy} /> :
                <div className="w-18 h-18"></div>

            }
        </div>
    );
};