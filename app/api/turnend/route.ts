// Next.js Route Handler: /api/turnend
// 백엔드(예: 파이썬 서버)에서 손바닥 인식 시 GET or POST /api/turnend?action=execute 로 호출합니다.
// 프론트엔드 React 훅(useTurnEndListener)이 1초마다 같은 엔드포인트를
// GET /api/turnend?action=execute&_t=TIMESTAMP 형태로 폴링합니다.
//
//  • 백엔드 트리거( _t 파라미터 없음 ) → pendingTurnEnd = true 설정
//  • 폴링 요청( _t 파라미터 존재 )   → pendingTurnEnd 플래그를 읽어 success 반환
//      └ 한 번 success:true 를 응답한 뒤에는 플래그를 지워 중복 트리거를 방지합니다.

import { NextRequest, NextResponse } from 'next/server'

// 모듈 스코프 변수로 간단 상태 저장 (Vercel Edge/FaaS 환경에서도 동일 인스턴스 내에서는 유지됨)
let pendingTurnEndTimestamp: string | null = null

function markTurnEndTriggered() {
  pendingTurnEndTimestamp = new Date().toISOString()
  console.log('[TURNEND] 백엔드 트리거 수신', pendingTurnEndTimestamp)
}

function consumeTurnEnd() {
  const ts = pendingTurnEndTimestamp
  pendingTurnEndTimestamp = null
  return ts
}

async function handleRequest(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const action = searchParams.get('action')

  if (action !== 'execute') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  // _t 파라미터는 프론트엔드 폴링 요청에서만 존재하도록 설계
  const isPollingRequest = searchParams.has('_t')

  if (isPollingRequest) {
    // 클라이언트 폴링 -> pending 여부 반환
    const ts = consumeTurnEnd()
    if (ts) {
      return NextResponse.json({ success: true, timestamp: ts })
    }
    return NextResponse.json({ success: false })
  }

  // 백엔드 트리거 (POST or GET 모두 허용)
  markTurnEndTriggered()
  return NextResponse.json({ received: true })
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}