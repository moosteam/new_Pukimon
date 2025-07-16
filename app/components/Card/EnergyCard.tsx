import React from "react";
import { Draggable } from "../Draggable";

interface EnergyCardProps {
    isReversed: boolean;
    isVisible: boolean;
}

export const EnergyCard: React.FC<EnergyCardProps> = ({
    isReversed,
    isVisible
}) => {
    if (!isVisible) return null;
    
    return (
        <Draggable 
            isReversed={isReversed} 
            key={'energy'} 
            id={'energy'}
            imgLink={``}
        >
            <div className="relative">
                <img
                    src={`ui/energy.png`}
                    alt="Energy Card"
                    className="z-[9999999999999999999999999999999999999999999999] w-18 transition-all duration-500 cursor-grab hover:scale-110"
                />
            </div>
        </Draggable>
    );
};