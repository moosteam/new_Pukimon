// 진화 관련 스타일 및 효과 정의
export const evolutionStyles = {
  // 진화 가능한 카드에 적용할 황금색 그림자 효과
  evolveBoxShadow: "0 0 15px 5px rgba(255, 215, 0, 0.6)",
  
  // 일반 카드 그림자 효과
  normalBoxShadow: "0 0 0px 3px rgba(255, 255, 255, 1)",
  
  // 진화 가능 표시 아이콘 스타일
  evolveIndicatorLarge: {
    className: "absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center z-10 animate-pulse",
    content: "↑"
  },
  
  evolveIndicatorSmall: {
    className: "absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center z-10 animate-pulse",
    content: "↑"
  }
};