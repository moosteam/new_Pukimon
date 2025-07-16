import React from 'react';
import { Droppable } from '../Droppable';
import { useAtomValue } from 'jotai';
import { data } from '../../data/cards'; // 카드 데이터 가져오기
import { 
    myWaitingPokemonEnergyAtom, 
    enemyWaitingPokemonEnergyAtom,
    myWaitingPokemonHPAtom,
    enemyWaitingPokemonHPAtom,
    myTurnAtom,
    droppedCardsAtom
} from '../../atom';
import { useCanEvolve } from '../../utils/evolution';
import { evolutionStyles } from '../../styles/evolution';
import { EvolutionIndicator } from '../Evolution/EvolutionIndicator';

interface WaitingProps {
    isMy: boolean;
}

import { 
    pokemonPlacementTurnAtom,
    gameTurnCountAtom
} from '../../atom';

export const Waiting: React.FC<WaitingProps> = ({ isMy }) => {
    const myTurn = useAtomValue(myTurnAtom);
    const droppedCards = useAtomValue(droppedCardsAtom);
    const ownerPrefix = isMy ? 'my' : 'enemy';
    const waitingZones = [1, 2, 3].map(num => `${ownerPrefix}_waiting_${num}`);
    
    // Get the appropriate energy and HP atoms
    const myWaitingEnergy = useAtomValue(myWaitingPokemonEnergyAtom);
    const enemyWaitingEnergy = useAtomValue(enemyWaitingPokemonEnergyAtom);
    const myWaitingHP = useAtomValue(myWaitingPokemonHPAtom);
    const enemyWaitingHP = useAtomValue(enemyWaitingPokemonHPAtom);
    const pokemonPlacementTurn = useAtomValue(pokemonPlacementTurnAtom);
    const gameTurnCount = useAtomValue(gameTurnCountAtom);
    
    return (
        <div className="flex flex-row" style={{ position: 'relative', zIndex: 10 }}>
            {waitingZones.map((zoneId, index) => {
                // 진화 가능 여부 확인 - 유틸리티 함수 사용
                const canEvolve = useCanEvolve(zoneId, isMy);
                
                return (
                    <Droppable key={zoneId} id={zoneId}>
                        <div 
                            className="w-18 h-25 border-3 rounded-lg flex items-center justify-center"
                            style={{
                                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: myTurn ? "scale(1)" : "scale(-1, -1)",
                                transformOrigin: "center center",
                                perspective: "1000px",
                                boxShadow: canEvolve ? 
                                    evolutionStyles.evolveBoxShadow : 
                                    "none"
                            }}
                        >
                            {droppedCards[zoneId] && (
                                <div className="drop-card">
                                    {/* 진화 가능 표시 - 컴포넌트 사용 */}
                                    {canEvolve && <EvolutionIndicator size="small" />}
                                    
                                    {/* Display energy icons */}
                                    {Array((isMy ? myWaitingEnergy : enemyWaitingEnergy)[index] >= 5 ? 1 : (isMy ? myWaitingEnergy : enemyWaitingEnergy)[index]).fill(0).map((_, i) => (
                                        <img 
                                            key={i} 
                                            src="ui/energy.png"
                                            className="absolute h-[1.5rem]"
                                            style={{paddingLeft: `${i*1.7}rem`}}
                                        />
                                    ))}
                                    {(isMy ? myWaitingEnergy : enemyWaitingEnergy)[index] >= 5 &&
                                        <div
                                            className="absolute h-[1.5rem] pl-[2rem] text-white font-bold"
                                            style={{ 
                                                textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" 
                                            }}
                                        >{(isMy ? myWaitingEnergy : enemyWaitingEnergy)[index]}</div>
                                    }
                                    
                                    {/* Display HP */}
                                    <div
                                        className={`absolute text-black font-bold text-xl mt-[-10]`}
                                        style={{
                                            textShadow: "-1px 0px white, 0px 1px white, 1px 0px white, 0px -1px white",
                                            marginLeft: ((isMy ? myWaitingHP : enemyWaitingHP)[index]) >= 100 ? "4.2rem" : "3.2rem"
                                        }}
                                    >{(isMy ? myWaitingHP : enemyWaitingHP)[index]}</div>
                                    <progress
                                        className="text-green-300 progress absolute mt-[12] w-8 ml-10 h-[.6rem] border-2 border-black rounded-full"
                                        id="progress"
                                        value={(isMy ? myWaitingHP : enemyWaitingHP)[index]}
                                        max={droppedCards[zoneId] ? data[droppedCards[zoneId]]?.hp || 100 : 100}
                                        style={{ zIndex: 10 }}
                                    ></progress>
                                     
                                    <img 
                                        src={droppedCards[zoneId]} 
                                        alt={droppedCards[zoneId]}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </Droppable>
                );
            })}
        </div>
    );
};