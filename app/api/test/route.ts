import { NextRequest, NextResponse } from 'next/server'

// 마지막 요청 추적을 위한 변수
let lastPukiRequest: { puki: string | null, timestamp: string } | null = null

export async function GET(request: NextRequest) {
  // URL에서 쿼리 파라미터 가져오기
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  const puki = searchParams.get('puki')
  const currentTimestamp = new Date().toISOString()
  
  // 새로운 puki 요청이 있으면 기록
  if (puki) {
    lastPukiRequest = { puki, timestamp: currentTimestamp }
    console.log('새로운 Puki 요청 기록:', { puki, timestamp: currentTimestamp })
  }
  
  // 응답 데이터
  const responseData = {
    message: 'GET 요청을 성공적으로 받았습니다!',
    timestamp: currentTimestamp,
    queryParams: {
      name: name || 'Anonymous',
      puki: puki || null
    },
    lastPukiRequest: lastPukiRequest // 마지막 puki 요청 정보 포함
  }
  
  // JSON 응답 반환
  return NextResponse.json(responseData, { status: 200 })
}

// POST 요청도 처리하고 싶다면
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'POST 요청을 받았습니다',
      receivedData: body
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid JSON'
    }, { status: 400 })
  }
} 