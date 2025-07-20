"use client"

import { useEffect, useRef } from 'react'

interface UseAttackListenerProps {
  onAttack: () => void
  pollInterval?: number // ms
}

/**
 * 백엔드에서 /api/attack 트리거 → 플래그 → 폴링 → localStorage('attack') → onAttack 실행
 * 턴 종료 리스너(useTurnEndListener)와 동일한 패턴을 재사용합니다.
 */
export function useAttackListener({ onAttack, pollInterval = 500 }: UseAttackListenerProps) {
  const lastExecRef = useRef<number>(0)
  const pageLoadRef = useRef<number>(Date.now())
  const COOLDOWN_MS = 3000 // 3초 중복 방지
  const INITIAL_IGNORE_MS = 1500 // 페이지 로드 직후 신호 무시

  // localStorage 값을 체크하여 onAttack 수행
  const checkLocalStorage = () => {
    if (localStorage.getItem('attack') === 'true') {
      const now = Date.now()
      if (now - pageLoadRef.current < INITIAL_IGNORE_MS) {
        localStorage.setItem('attack', 'false')
        return
      }
      if (now - lastExecRef.current < COOLDOWN_MS) {
        localStorage.setItem('attack', 'false')
        return
      }
      lastExecRef.current = now
      localStorage.setItem('attack', 'false')
      onAttack()
    }
  }

  // 서버 API 폴링
  const pollServer = async () => {
    try {
      const res = await fetch(`/api/attack?action=execute&_t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          localStorage.setItem('attack', 'true')
        }
      }
    } catch (e) {
      // 네트워크 오류 무시
      console.error('attack poll error', e)
    }
  }

  useEffect(() => {
    const localId = setInterval(checkLocalStorage, pollInterval)
    const apiId = setInterval(pollServer, 1000)

    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'attack' && e.newValue === 'true') {
        checkLocalStorage()
      }
    }
    window.addEventListener('storage', storageHandler)

    return () => {
      clearInterval(localId)
      clearInterval(apiId)
      window.removeEventListener('storage', storageHandler)
    }
  }, [pollInterval, onAttack])

  // 외부에서 수동으로 트리거할 수 있는 API 반환
  return {
    triggerAttack: () => localStorage.setItem('attack', 'true'),
    resetAttack: () => localStorage.setItem('attack', 'false')
  }
}