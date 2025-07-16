import AutoplayVideo from "./AutoplayVideo";

interface CoinAnimationProps {
    startVideo: any;
    coinTextOpacity: any;
}

export const CoinAnimation: React.FC<CoinAnimationProps> = ({
    startVideo,
    coinTextOpacity,
}) => {
    return (
        <>
            {startVideo && (
                <AutoplayVideo
                    src="FlipBack.webm"
                    className="w-full max-w-lg absolute top-[52%] left-[50%] transform scale-50 translate-x-[-50%] translate-y-[-50%] pointer-events-none z-1000"
                />
            )}

            {/* 코인 텍스트 */}
            <div
                className="w-[35%] max-w-lg absolute z-70 top-[42%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center rounded-4xl bg-gradient-to-r from-[#09B9FE] to-[#3A8AFE] font-extrabold transform transition-all duration-1500 text-[.8rem]"
                style={{ opacity: `${coinTextOpacity}` }}>
                후공
            </div>

            {/* 코인 배경 효과 */}
            <div className="w-full h-full absolute z-65 transition-all duration-1000 bg-[linear-gradient(to_bottom,#FE8E68,#FF9C6A,#FFB679,#FF9C6A,#FE8E68)]"
                style={{ opacity: `${coinTextOpacity}`, pointerEvents: "none" }}>
            </div>
        </>
    )
}