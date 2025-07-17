import { NextRequest, NextResponse } from 'next/server'

// 게임 상태를 저장할 간단한 메모리 스토어 (실제로는 데이터베이스 사용)
let gameState = {
  player1Score: 0,
  player2Score: 0,
  currentTurn: 'player1',
  gameActive: false
}

export async function GET(request: NextRequest) {
  // 특정 정보만 요청하는 경우
  const searchParams = request.nextUrl.searchParams
  const info = searchParams.get('info')
  
  if (info === 'score') {
    return NextResponse.json({
      player1Score: gameState.player1Score,
      player2Score: gameState.player2Score
    })
  }
  
  // 전체 게임 상태 반환
  return NextResponse.json({
    status: 'success',
    gameState: gameState
  })
}

// 게임 상태 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'start':
        gameState = {
          player1Score: 0,
          player2Score: 0,
          currentTurn: 'player1',
          gameActive: true
        }
        break
        
      case 'updateScore':
        if (data.player === 'player1') {
          gameState.player1Score = data.score
        } else if (data.player === 'player2') {
          gameState.player2Score = data.score
        }
        break
        
      case 'changeTurn':
        gameState.currentTurn = gameState.currentTurn === 'player1' ? 'player2' : 'player1'
        break
        
      case 'end':
        gameState.gameActive = false
        break
        
      default:
        return NextResponse.json({
          error: 'Unknown action'
        }, { status: 400 })
    }
    
    return NextResponse.json({
      status: 'success',
      gameState: gameState
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request'
    }, { status: 400 })
  }
} 