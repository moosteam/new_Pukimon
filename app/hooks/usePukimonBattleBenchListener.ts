'use client'

import { useEffect, useRef } from 'react'

export function usePukimonBattleBenchListener(pollInterval: number = 1000) {
  const lastBattleTimestampRef = useRef<string | null>(null)
  const lastBench1TimestampRef = useRef<string | null>(null)
  const lastBench2TimestampRef = useRef<string | null>(null)
  const lastBench3TimestampRef = useRef<string | null>(null)

  // 초기화 시 이전 데이터 클리어
  useEffect(() => {
    console.log('🧹 Pukimon 리스너 초기화 - 이전 데이터 클리어')
    localStorage.removeItem('currentBattlePukimon')
    localStorage.removeItem('lastBattlePukimonUpdate')
    localStorage.removeItem('lastBattleRequestTimestamp')
    // 벤치별 데이터 클리어
    for (let i = 1; i <= 3; i++) {
      localStorage.removeItem(`currentBench${i}Pukimon`)
      localStorage.removeItem(`lastBench${i}PukimonUpdate`)
      localStorage.removeItem(`lastBench${i}RequestTimestamp`)
    }
    lastBattleTimestampRef.current = null
    lastBench1TimestampRef.current = null
    lastBench2TimestampRef.current = null
    lastBench3TimestampRef.current = null
  }, [])

  // 페이지 로드 시간 기록 (이전 요청 무시용)
  const pageLoadTimeRef = useRef(new Date().toISOString())

  useEffect(() => {
    const checkForPukimon = async () => {
      try {
        // 배틀필드와 벤치 1,2,3 API를 동시에 체크
        const [battleResponse, bench1Response, bench2Response, bench3Response] = await Promise.all([
          fetch('/api/battle?' + Date.now()),
          fetch('/api/bench1?' + Date.now()),
          fetch('/api/bench2?' + Date.now()),
          fetch('/api/bench3?' + Date.now())
        ])

        // 배틀필드 처리
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

        // 벤치1 처리
        if (bench1Response.ok) {
          const bench1Data = await bench1Response.json()
          const bench1Request = bench1Data.lastBench1Request

          console.log('🔍 벤치1 API 폴링 결과:', {
            bench1Request,
            timestamp: bench1Data.timestamp
          })

          // 새로운 벤치1 요청 감지 (페이지 로드 이후의 요청만 처리)
          if (bench1Request?.puki && 
              bench1Request.timestamp !== lastBench1TimestampRef.current &&
              bench1Request.timestamp > pageLoadTimeRef.current) {
            
            console.log('새로운 벤치1 Pukimon 감지:', bench1Request.puki, '(페이지 로드 이후 요청)')
            lastBench1TimestampRef.current = bench1Request.timestamp

            // localStorage에 저장
            localStorage.setItem('currentBench1Pukimon', bench1Request.puki)
            localStorage.setItem('lastBench1PukimonUpdate', bench1Request.timestamp)
            localStorage.setItem('lastBench1RequestTimestamp', bench1Request.timestamp)

            // 커스텀 이벤트 발생 (벤치 번호 포함)
            window.dispatchEvent(new CustomEvent('benchPukimonDetected', {
              detail: { 
                puki: bench1Request.puki, 
                timestamp: bench1Request.timestamp,
                type: 'bench',
                benchNumber: 1
              }
            }))
          }
        }

        // 벤치2 처리
        if (bench2Response.ok) {
          const bench2Data = await bench2Response.json()
          const bench2Request = bench2Data.lastBench2Request

          console.log('🔍 벤치2 API 폴링 결과:', {
            bench2Request,
            timestamp: bench2Data.timestamp
          })

          // 새로운 벤치2 요청 감지 (페이지 로드 이후의 요청만 처리)
          if (bench2Request?.puki && 
              bench2Request.timestamp !== lastBench2TimestampRef.current &&
              bench2Request.timestamp > pageLoadTimeRef.current) {
            
            console.log('새로운 벤치2 Pukimon 감지:', bench2Request.puki, '(페이지 로드 이후 요청)')
            lastBench2TimestampRef.current = bench2Request.timestamp

            // localStorage에 저장
            localStorage.setItem('currentBench2Pukimon', bench2Request.puki)
            localStorage.setItem('lastBench2PukimonUpdate', bench2Request.timestamp)
            localStorage.setItem('lastBench2RequestTimestamp', bench2Request.timestamp)

            // 커스텀 이벤트 발생 (벤치 번호 포함)
            window.dispatchEvent(new CustomEvent('benchPukimonDetected', {
              detail: { 
                puki: bench2Request.puki, 
                timestamp: bench2Request.timestamp,
                type: 'bench',
                benchNumber: 2
              }
            }))
          }
        }

        // 벤치3 처리
        if (bench3Response.ok) {
          const bench3Data = await bench3Response.json()
          const bench3Request = bench3Data.lastBench3Request

          console.log('🔍 벤치3 API 폴링 결과:', {
            bench3Request,
            timestamp: bench3Data.timestamp
          })

          // 새로운 벤치3 요청 감지 (페이지 로드 이후의 요청만 처리)
          if (bench3Request?.puki && 
              bench3Request.timestamp !== lastBench3TimestampRef.current &&
              bench3Request.timestamp > pageLoadTimeRef.current) {
            
            console.log('새로운 벤치3 Pukimon 감지:', bench3Request.puki, '(페이지 로드 이후 요청)')
            lastBench3TimestampRef.current = bench3Request.timestamp

            // localStorage에 저장
            localStorage.setItem('currentBench3Pukimon', bench3Request.puki)
            localStorage.setItem('lastBench3PukimonUpdate', bench3Request.timestamp)
            localStorage.setItem('lastBench3RequestTimestamp', bench3Request.timestamp)

            // 커스텀 이벤트 발생 (벤치 번호 포함)
            window.dispatchEvent(new CustomEvent('benchPukimonDetected', {
              detail: { 
                puki: bench3Request.puki, 
                timestamp: bench3Request.timestamp,
                type: 'bench',
                benchNumber: 3
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
    getBench1Pukimon: () => localStorage.getItem('currentBench1Pukimon'),
    getBench2Pukimon: () => localStorage.getItem('currentBench2Pukimon'),
    getBench3Pukimon: () => localStorage.getItem('currentBench3Pukimon'),
    clearPukimonData: () => {
      localStorage.removeItem('currentBattlePukimon')
      localStorage.removeItem('lastBattlePukimonUpdate')
      localStorage.removeItem('lastBattleRequestTimestamp')
      // 벤치별 데이터 클리어
      for (let i = 1; i <= 3; i++) {
        localStorage.removeItem(`currentBench${i}Pukimon`)
        localStorage.removeItem(`lastBench${i}PukimonUpdate`)
        localStorage.removeItem(`lastBench${i}RequestTimestamp`)
      }
      lastBattleTimestampRef.current = null
      lastBench1TimestampRef.current = null
      lastBench2TimestampRef.current = null
      lastBench3TimestampRef.current = null
    }
  }
} 