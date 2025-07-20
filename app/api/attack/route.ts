// Next.js Route Handler: /api/attack
// 백엔드가 손가락을 화살표 모양으로 인식하면 /api/attack?action=execute 로 호출합니다.
// 프론트엔드는 폴링 요청(/api/attack?action=execute&_t=TS)을 보내 success 여부를 확인합니다.

import { NextRequest, NextResponse } from 'next/server'

let pendingAttackTimestamp: string | null = null

function markAttackTriggered() {
  pendingAttackTimestamp = new Date().toISOString()
  console.log('[ATTACK] 백엔드 트리거 수신', pendingAttackTimestamp)
}

function consumeAttack() {
  const ts = pendingAttackTimestamp
  pendingAttackTimestamp = null
  return ts
}

async function handleRequest(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // 1) 클라이언트 폴링 요청: _t 파라미터 존재
  const isPollingRequest = searchParams.has('_t')
  if (isPollingRequest) {
    const ts = consumeAttack()
    if (ts) {
      return NextResponse.json({ success: true, timestamp: ts })
    }
    return NextResponse.json({ success: false })
  }

  // 2) 백엔드 트리거 요청 (GET/POST) : _t 없음 → 바로 플래그 세팅
  //    action 파라미터가 없거나 action=execute 모두 허용
  // 플래그 기록
  markAttackTriggered()
  return NextResponse.json({ received: true })
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
} 