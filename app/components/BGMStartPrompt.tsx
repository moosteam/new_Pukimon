import { useEffect, useState } from 'react';

interface BGMStartPromptProps {
    hasUserInteracted: boolean;
}

export const BGMStartPrompt = ({ hasUserInteracted }: BGMStartPromptProps) => {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // 3초 후에 프롬프트 표시
        const timer = setTimeout(() => {
            if (!hasUserInteracted) {
                setShowPrompt(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [hasUserInteracted]);

    if (hasUserInteracted || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
                <div className="text-6xl mb-4">🎵</div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    BGM 시작하기
                </h2>
                <p className="text-gray-600 mb-6">
                    게임의 분위기를 더욱 생생하게 만들어주는 BGM을 시작하려면<br />
                    아무 곳이나 클릭해주세요!
                </p>
                <div className="text-sm text-gray-500">
                    💡 팁: 카드를 드래그하거나 클릭하면 BGM이 자동으로 시작됩니다
                </div>
            </div>
        </div>
    );
}; 