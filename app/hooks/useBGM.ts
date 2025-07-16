import { useState, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { 
    myTurnAtom, 
    myGameScoreAtom, 
    enemyGameScoreAtom 
} from '../atom';

type BGMType = 'start' | 'normal' | 'expert' | 'pinch' | 'chance' | 'result';

export const useBGM = () => {
    const myTurn = useAtomValue(myTurnAtom);
    const myGameScore = useAtomValue(myGameScoreAtom);
    const enemyGameScore = useAtomValue(enemyGameScoreAtom);
    
    const [currentBGM, setCurrentBGM] = useState<BGMType>('normal');
    const [isFirstTurn, setIsFirstTurn] = useState(true);
    const [turnCount, setTurnCount] = useState(0);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pendingBGMRef = useRef<BGMType | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // BGM 재생 중복 방지를 위한 ref 추가
    const isPlayingRef = useRef<boolean>(false);
    
    // BGM 파일 경로 매핑
    const bgmFiles: Record<BGMType, string> = {
        start: '/bgm/Start-BGM.mp3',
        normal: '/bgm/Normal-BGM.mp3',
        expert: '/bgm/Expert-BGM.mp3',
        pinch: '/bgm/Pinch-BGM.mp3',
        chance: '/bgm/Chance-BGM.mp3',
        result: '/bgm/Result-BGM.mp3'
    };

    // 모든 페이드 인터벌 정리 함수
    const clearFadeInterval = () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    };

    // 오디오 완전 정리 함수
    const cleanupAudio = (audio: HTMLAudioElement) => {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            audio.load();
        } catch (error) {
            console.log('오디오 정리 중 오류:', error);
        }
    };

    // 페이드 아웃 함수
    const fadeOut = (duration: number = 1000): Promise<void> => {
        return new Promise((resolve) => {
            if (!audioRef.current) {
                resolve();
                return;
            }

            const audio = audioRef.current;
            const startVolume = audio.volume;
            const steps = 20;
            const stepDuration = duration / steps;
            const volumeStep = startVolume / steps;

            clearFadeInterval(); // 기존 인터벌 정리

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume > volumeStep) {
                    audio.volume -= volumeStep;
                } else {
                    audio.volume = 0;
                    clearFadeInterval();
                    cleanupAudio(audio); // 완전한 오디오 정리
                    resolve();
                }
            }, stepDuration);
        });
    };

    // 페이드 인 함수
    const fadeIn = (audio: HTMLAudioElement, duration: number = 1000): Promise<void> => {
        return new Promise((resolve) => {
            audio.volume = 0;
            const targetVolume = 0.3;
            const steps = 20;
            const stepDuration = duration / steps;
            const volumeStep = targetVolume / steps;

            clearFadeInterval(); // 기존 인터벌 정리

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume < targetVolume - volumeStep) {
                    audio.volume += volumeStep;
                } else {
                    audio.volume = targetVolume;
                    clearFadeInterval();
                    resolve();
                }
            }, stepDuration);
        });
    };

    // 사용자 상호작용 감지
    useEffect(() => {
        const handleUserInteraction = () => {
            if (!hasUserInteracted) {
                setHasUserInteracted(true);
                // 대기 중인 BGM이 있으면 재생
                if (pendingBGMRef.current) {
                    playBGM(pendingBGMRef.current);
                    pendingBGMRef.current = null;
                }
            }
        };

        // 다양한 사용자 상호작용 이벤트 리스너 추가
        const events = ['click', 'touchstart', 'keydown', 'mousedown'];
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
    }, [hasUserInteracted]);

    // BGM 재생 함수 (페이드 효과 포함)
    const playBGM = async (bgmType: BGMType) => {
        // 중복 재생 방지
        if (isPlayingRef.current) {
            return;
        }

        // 사용자가 아직 상호작용하지 않았다면 대기
        if (!hasUserInteracted) {
            pendingBGMRef.current = bgmType;
            return;
        }

        // 현재 BGM과 같다면 재생하지 않음
        if (currentBGM === bgmType && audioRef.current && !audioRef.current.paused) {
            return;
        }

        isPlayingRef.current = true;

        try {
            // 기존 BGM 페이드 아웃 및 완전 정리
            await fadeOut(800);
            
            // 이전 오디오 레퍼런스 정리
            if (audioRef.current) {
                cleanupAudio(audioRef.current);
                audioRef.current = null;
            }

            // 새로운 BGM 생성 및 재생
            const audio = new Audio(bgmFiles[bgmType]);
            audio.loop = true;
            audio.volume = 0;
            
            // 자동 재생 정책 우회를 위한 설정
            audio.muted = false;
            audio.autoplay = false;
            
            try {
                await audio.play();
                // 페이드 인 시작
                await fadeIn(audio, 800);
                
                audioRef.current = audio;
                setCurrentBGM(bgmType);
            } catch (error) {
                console.log('BGM 재생 실패:', error);
                // 재생 실패 시 다시 시도
                setTimeout(async () => {
                    try {
                        await audio.play();
                        await fadeIn(audio, 800);
                        audioRef.current = audio;
                        setCurrentBGM(bgmType);
                    } catch (e) {
                        console.log('BGM 재생 재시도 실패:', e);
                    }
                }, 100);
            }
        } finally {
            isPlayingRef.current = false;
        }
    };

    // BGM 정지 함수
    const stopBGM = async () => {
        clearFadeInterval();
        
        if (audioRef.current) {
            await fadeOut(500);
            cleanupAudio(audioRef.current);
            audioRef.current = null;
        }
        isPlayingRef.current = false;
    };

    // 턴 변경 감지
    useEffect(() => {
        if (isFirstTurn) {
            // 첫 번째 턴일 때 start BGM
            playBGM('start');
            setIsFirstTurn(false);
        } else if (turnCount <= 2) {
            // 2턴까지는 start BGM 유지
            if (currentBGM !== 'start') {
                playBGM('start');
            }
        } else {
            // 3턴부터는 상황에 따른 BGM
            if (currentBGM === 'start') {
                playBGM('normal');
            }
        }
    }, [myTurn, turnCount]);

    // 턴 카운트 증가
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isFirstTurn) {
                setTurnCount(prev => prev + 1);
            }
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [myTurn, isFirstTurn]);

    // 점수 변화 감지 및 BGM 변경
    useEffect(() => {
        // 게임 종료 체크
        if (myGameScore >= 3 || enemyGameScore >= 3) {
            playBGM('result');
            return;
        }

        // 승리까지 1점 남은 상황 체크
        if (myGameScore === 2 || enemyGameScore === 2) {
            if (currentBGM !== 'chance' && currentBGM !== 'result') {
                playBGM('chance');
            }
            return;
        }

        // 점수 득점 시 expert 또는 pinch BGM
        if (myGameScore > 0 || enemyGameScore > 0) {
            const totalScore = myGameScore + enemyGameScore;
            if (totalScore >= 2) {
                // 2점 이상이면 pinch BGM
                if (currentBGM !== 'pinch' && currentBGM !== 'chance' && currentBGM !== 'result') {
                    playBGM('pinch');
                }
            } else {
                // 1점이면 expert BGM
                if (currentBGM !== 'expert' && currentBGM !== 'chance' && currentBGM !== 'result') {
                    playBGM('expert');
                }
            }
            return;
        }

        // 기본 상황: normal BGM
        if (turnCount > 2 && currentBGM !== 'normal' && currentBGM !== 'start') {
            playBGM('normal');
        }
    }, [myGameScore, enemyGameScore, turnCount, currentBGM]);

    // 컴포넌트 언마운트 시 BGM 정지
    useEffect(() => {
        return () => {
            clearFadeInterval();
            stopBGM();
        };
    }, []);

    return {
        currentBGM,
        playBGM,
        stopBGM,
        hasUserInteracted
    };
}; 