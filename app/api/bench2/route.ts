import { NextRequest, NextResponse } from 'next/server'

// 마지막 벤치2 요청 추적을 위한 변수
let lastBench2Request: { puki: string | null, timestamp: string } | null = null

export async function GET(request: NextRequest) {
  // URL에서 쿼리 파라미터 가져오기
  const searchParams = request.nextUrl.searchParams
  const puki = searchParams.get('puki')
  const currentTimestamp = new Date().toISOString()
  
  // 새로운 puki 요청이 있으면 기록
  if (puki) {
    lastBench2Request = { puki, timestamp: currentTimestamp }
    console.log('새로운 벤치2 Puki 요청 기록:', { puki, timestamp: currentTimestamp })
  }
  
  // 응답 데이터
  const responseData = {
    message: '벤치2 배치 요청을 성공적으로 받았습니다!',
    timestamp: currentTimestamp,
    type: 'bench2',
    queryParams: {
      puki: puki || null
    },
    lastBench2Request: lastBench2Request // 마지막 벤치2 요청 정보 포함
  }
  
  // JSON 응답 반환
  return NextResponse.json(responseData, { status: 200 })
} 