'use client'

import { useEffect, useRef } from 'react'

export function usePukimonListener(pollInterval: number = 1000) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPukiRef = useRef<string | null>(null)

  useEffect(() => {
    const checkForPuki = async () => {
      try {
        const response = await fetch('/api/test?' + Date.now()) // 캐시 방지
        if (!response.ok) return
        
        const data = await response.json()
        const puki = data.queryParams?.puki
        const lastPukiRequest = data.lastPukiRequest
        
        console.log('API 폴링 결과:', { 
          puki, 
          timestamp: data.timestamp, 
          lastPukiRequest 
        })
        
        // lastPukiRequest가 있고 새로운 요청인 경우 처리
        if (lastPukiRequest?.puki) {
          const lastProcessedTimestamp = localStorage.getItem('lastProcessedPukiTimestamp')
          
                     // 새로운 타임스탬프이거나 처음 요청인 경우만 처리
           if (!lastProcessedTimestamp || lastPukiRequest.timestamp !== lastProcessedTimestamp) {
             const detectedPuki = lastPukiRequest.puki
             const currentTime = lastPukiRequest.timestamp
             
             console.log('새로운 Pukimon 감지:', detectedPuki)
             
             // localStorage에 저장
             localStorage.setItem('currentPukimon', detectedPuki)
             localStorage.setItem('lastPukimonUpdate', currentTime)
             localStorage.setItem('lastProcessedPukiTimestamp', currentTime)
             
             // 히스토리 저장 (선택사항)
             const history = JSON.parse(localStorage.getItem('pukimonHistory') || '[]')
             history.push({
               puki: detectedPuki,
               timestamp: currentTime
             })
             localStorage.setItem('pukimonHistory', JSON.stringify(history))
             
             lastPukiRef.current = detectedPuki
             
             // 커스텀 이벤트 발생 (다른 컴포넌트에서 감지 가능)
             window.dispatchEvent(new CustomEvent('pukimonDetected', { 
               detail: { puki: detectedPuki, timestamp: currentTime } 
             }))
           }
        }
      } catch (error) {
        console.error('Pukimon 체크 중 오류:', error)
      }
    }
    
    // 초기 체크
    checkForPuki()
    
    // 주기적으로 체크
    intervalRef.current = setInterval(checkForPuki, pollInterval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pollInterval])
  
  return {
    getCurrentPukimon: () => localStorage.getItem('currentPukimon'),
    getPukimonHistory: () => JSON.parse(localStorage.getItem('pukimonHistory') || '[]'),
    clearPukimonData: () => {
      localStorage.removeItem('currentPukimon')
      localStorage.removeItem('lastPukimonUpdate')
      localStorage.removeItem('pukimonHistory')
      lastPukiRef.current = null
    }
  }
} 