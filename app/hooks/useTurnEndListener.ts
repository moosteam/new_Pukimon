'use client'

import { useEffect, useRef } from 'react'

interface UseTurnEndListenerProps {
  pollInterval?: number
  onTurnEnd: () => void
}

export function useTurnEndListener({ 
  pollInterval = 100, // localStorage는 빠르게 체크 가능
  onTurnEnd 
}: UseTurnEndListenerProps) {
  const lastExecutionTimeRef = useRef<number>(0)
  const pageLoadTimeRef = useRef<number>(Date.now())
  const COOLDOWN_MS = 5000 // 5초 쿨다운
  const INITIAL_DELAY_MS = 2000 // 페이지 로드 후 2초간은 무시

  useEffect(() => {
    console.log('🎮 턴 종료 리스너 초기화 (localStorage 방식)')
    
    // 초기값 강제 설정 (이전 값 무시)
    localStorage.setItem('turnend', 'false')
    console.log('🔄 turnend 초기값 false로 강제 설정')

    // localStorage 감시 함수
    const checkTurnEnd = () => {
      const turnEndValue = localStorage.getItem('turnend')
      
      if (turnEndValue === 'true') {
        const currentTime = Date.now()
        
        // 페이지 로드 직후 체크 (초기 2초간은 무시)
        const timeSincePageLoad = currentTime - pageLoadTimeRef.current
        if (timeSincePageLoad < INITIAL_DELAY_MS) {
          console.log('🚫 페이지 로드 직후라 턴 종료 무시')
          localStorage.setItem('turnend', 'false')
          return
        }
        
        const timeSinceLastExecution = currentTime - lastExecutionTimeRef.current
        
        // 쿨다운 체크
        if (timeSinceLastExecution < COOLDOWN_MS) {
          console.log(`⏳ 턴 종료 쿨다운 중... ${Math.ceil((COOLDOWN_MS - timeSinceLastExecution) / 1000)}초 남음`)
          // 쿨다운 중이면 false로 리셋만 하고 실행하지 않음
          localStorage.setItem('turnend', 'false')
          return
        }
        
        console.log('🏁 턴 종료 신호 감지! (localStorage: true)')
        
        // 즉시 false로 리셋
        localStorage.setItem('turnend', 'false')
        
        // 쿨다운 시간 기록
        lastExecutionTimeRef.current = currentTime
        
        // 실제 턴 종료 버튼 클릭
        const turnEndButton = document.getElementById('turn-end-button') as HTMLButtonElement
        if (turnEndButton) {
          console.log('🔘 턴 종료 버튼 클릭!')
          turnEndButton.click()
        } else {
          console.log('⚠️ 턴 종료 버튼을 찾을 수 없습니다. 직접 함수 호출')
          onTurnEnd()
        }
      }
    }

    // API 엔드포인트 체크 (손바닥을 폈을 때 외부에서 호출)
    const checkAPIEndpoint = async () => {
      try {
        const response = await fetch(`/api/turnend?action=execute&_t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          console.log('📡 API 응답:', data) // 디버깅용 로그 추가
          if (data.success) {
            console.log('🖐️ API에서 턴 종료 신호 받음')
            localStorage.setItem('turnend', 'true')
          }
          // success가 false일 때는 아무것도 하지 않음 (localStorage 변경 없음)
        }
      } catch (error) {
        console.error('API 체크 에러:', error)
        // API 체크 실패는 무시 (localStorage가 메인)
      }
    }

    // 주기적으로 체크
    const localStorageInterval = setInterval(checkTurnEnd, pollInterval)
    const apiInterval = setInterval(checkAPIEndpoint, 1000) // API는 1초마다 체크
    
    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'turnend' && e.newValue === 'true') {
        console.log('📢 다른 탭에서 턴 종료 신호 감지')
        checkTurnEnd()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(localStorageInterval)
      clearInterval(apiInterval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [pollInterval, onTurnEnd])

  return {
    // 수동으로 턴 종료 트리거
    triggerTurnEnd: () => {
      console.log('📱 수동 턴 종료 트리거')
      localStorage.setItem('turnend', 'true')
    },
    // 상태 초기화
    resetTurnEnd: () => {
      localStorage.setItem('turnend', 'false')
    }
  }
} 