import React from 'react';

interface OpeningOverlayProps {
    boardOpacity: number;
}

export const OpeningOverlay: React.FC<OpeningOverlayProps> = ({ boardOpacity }) => {
    return (
        <div className="absolute w-full h-full bg-white z-999999 transition-all duration-1000 pointer-events-none"
            style={{ opacity: `${boardOpacity}` }}></div>
    )
}