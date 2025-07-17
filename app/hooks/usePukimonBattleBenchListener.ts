'use client'

import { useEffect, useRef } from 'react'

export function usePukimonBattleBenchListener(pollInterval: number = 1000) {
  const lastBattleTimestampRef = useRef<string | null>(null)
  const lastBenchTimestampRef = useRef<string | null>(null)

  // 초기화 시 이전 데이터 클리어
  useEffect(() => {
    console.log('🧹 Pukimon 리스너 초기화 - 이전 데이터 클리어')
    localStorage.removeItem('currentBattlePukimon')
    localStorage.removeItem('lastBattlePukimonUpdate')
    localStorage.removeItem('lastBattleRequestTimestamp')
    localStorage.removeItem('currentBenchPukimon')
    localStorage.removeItem('lastBenchPukimonUpdate')
    localStorage.removeItem('lastBenchRequestTimestamp')
    lastBattleTimestampRef.current = null
    lastBenchTimestampRef.current = null
  }, [])

  // 페이지 로드 시간 기록 (이전 요청 무시용)
  const pageLoadTimeRef = useRef(new Date().toISOString())

  useEffect(() => {
    const checkForPukimon = async () => {
      try {
        // 배틀필드와 벤치 API를 동시에 체크
        const [battleResponse, benchResponse] = await Promise.all([
          fetch('/api/battle?' + Date.now()),
          fetch('/api/bench?' + Date.now())
        ])

        if (battleResponse.ok) {
          const battleData = await battleResponse.json()
          const battleRequest = battleData.lastBattleRequest

          console.log('🔍 배틀 API 폴링 결과:', {
            battleRequest,
            timestamp: battleData.timestamp,
            currentRef: lastBattleTimestampRef.current,
            pageLoadTime: pageLoadTimeRef.current,
            isAfterPageLoad: battleRequest?.timestamp > pageLoadTimeRef.current,
            hasNewRequest: battleRequest?.puki && battleRequest.timestamp !== lastBattleTimestampRef.current && battleRequest.timestamp > pageLoadTimeRef.current
          })

          // 새로운 배틀 요청 감지 (페이지 로드 이후의 요청만 처리)
          if (battleRequest?.puki && 
              battleRequest.timestamp !== lastBattleTimestampRef.current &&
              battleRequest.timestamp > pageLoadTimeRef.current) {
            
            console.log('새로운 배틀필드 Pukimon 감지:', battleRequest.puki, '(페이지 로드 이후 요청)')
            lastBattleTimestampRef.current = battleRequest.timestamp

            // localStorage에 저장
            localStorage.setItem('currentBattlePukimon', battleRequest.puki)
            localStorage.setItem('lastBattlePukimonUpdate', battleRequest.timestamp)
            localStorage.setItem('lastBattleRequestTimestamp', battleRequest.timestamp)

            // 커스텀 이벤트 발생
            window.dispatchEvent(new CustomEvent('battlePukimonDetected', {
              detail: { 
                puki: battleRequest.puki, 
                timestamp: battleRequest.timestamp,
                type: 'battle'
              }
            }))
          }
        }

        if (benchResponse.ok) {
          const benchData = await benchResponse.json()
          const benchRequest = benchData.lastBenchRequest

          console.log('벤치 API 폴링 결과:', {
            benchRequest,
            timestamp: benchData.timestamp
          })

          // 새로운 벤치 요청 감지 (페이지 로드 이후의 요청만 처리)
          if (benchRequest?.puki && 
              benchRequest.timestamp !== lastBenchTimestampRef.current &&
              benchRequest.timestamp > pageLoadTimeRef.current) {
            
            console.log('새로운 벤치 Pukimon 감지:', benchRequest.puki, '(페이지 로드 이후 요청)')
            lastBenchTimestampRef.current = benchRequest.timestamp

            // localStorage에 저장
            localStorage.setItem('currentBenchPukimon', benchRequest.puki)
            localStorage.setItem('lastBenchPukimonUpdate', benchRequest.timestamp)
            localStorage.setItem('lastBenchRequestTimestamp', benchRequest.timestamp)

            // 커스텀 이벤트 발생
            window.dispatchEvent(new CustomEvent('benchPukimonDetected', {
              detail: { 
                puki: benchRequest.puki, 
                timestamp: benchRequest.timestamp,
                type: 'bench'
              }
            }))
          }
        }

      } catch (error) {
        console.error('Pukimon 배틀/벤치 체크 중 오류:', error)
      }
    }
    
    // 초기 체크
    checkForPukimon()
    
    // 주기적으로 체크
    const intervalRef = setInterval(checkForPukimon, pollInterval)
    
    return () => {
      clearInterval(intervalRef)
    }
  }, [pollInterval])

  return {
    getBattlePukimon: () => localStorage.getItem('currentBattlePukimon'),
    getBenchPukimon: () => localStorage.getItem('currentBenchPukimon'),
    clearPukimonData: () => {
      localStorage.removeItem('currentBattlePukimon')
      localStorage.removeItem('lastBattlePukimonUpdate')
      localStorage.removeItem('lastBattleRequestTimestamp')
      localStorage.removeItem('currentBenchPukimon')
      localStorage.removeItem('lastBenchPukimonUpdate')
      localStorage.removeItem('lastBenchRequestTimestamp')
      lastBattleTimestampRef.current = null
      lastBenchTimestampRef.current = null
    }
  }
} 