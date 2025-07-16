import { boardRotateXAtom, attackScaleAtom } from "@/app/atom";
import { useAtom } from "jotai";

interface GameBoardProps {
  boardRotateZ: number;
  boardScale: number;
  children?: React.ReactNode; // children prop 추가
}

export const GameBoard: React.FC<GameBoardProps> = ({
  boardRotateZ, 
  boardScale, 
  children // children prop 추가
}) => {

  const [boardRotateX, setBoardRotateX] = useAtom(boardRotateXAtom)
  const [attackScale] = useAtom(attackScaleAtom)
  return (
    <div 
      className="absolute w-full h-full z-40 bg-none flex justify-between flex-col items-center p-2 transition-all duration-1500"
      style={{
        transform: `perspective(800px) rotateZ(${boardRotateZ}deg) scale(${boardScale * attackScale}) rotateX(${boardRotateX}deg) translateY(${boardRotateX > 0 ? boardRotateX * -1 / 1.5 : 0}rem)`,
        // 오프닝 부분 클릭 금지를 위해 rotate가 0일때 클릭할 수 없게 함
        pointerEvents: boardRotateX != 0 ? "auto" : "none"
      }}
    >
      <div className="w-full h-full absolute">
        <img
          src="ui/pukimon_battle_field.png"
          alt="Battle Field"
          className="absolute object-cover top-0 left-0 scale-170 translate-y-[50%] w-full h-full z-10 pointer-events-none"
          style={{ minWidth: '100%', height: 'auto' }}
        />
      </div>
      {children} {/* children 렌더링 */}
    </div>
  )
}