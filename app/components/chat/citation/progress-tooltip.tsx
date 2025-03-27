import React from 'react'
import type { FC } from 'react'

type ProgressTooltipProps = {
    data: number
}

const ProgressTooltip: FC<ProgressTooltipProps> = ({
    data
}) => {
    // Calculate color based on the score
    const getColor = () => {
        if (data >= 0.8) return 'bg-green-500'
        if (data >= 0.5) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="flex items-center mr-3 group relative">
            <span className="flex items-center text-[11px] text-gray-400 gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" />
                    <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getColor()}`}
                        style={{ width: `${data * 100}%` }}
                    ></div>
                </div>
                <span>{data.toFixed(2)}</span>
            </span>
            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block">
                <div className="bg-gray-700 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    Relevance Score
                </div>
                <div className="w-2 h-2 bg-gray-700 transform rotate-45 translate-x-2 -translate-y-1"></div>
            </div>
        </div>
    )
}

export default ProgressTooltip 