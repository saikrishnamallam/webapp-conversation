import React from 'react'
import type { FC, ReactNode } from 'react'

type TooltipProps = {
    text: string
    data: number | string
    icon: ReactNode
}

const Tooltip: FC<TooltipProps> = ({
    text,
    data,
    icon,
}) => {
    return (
        <div className="flex items-center mr-3 group relative">
            <span className="flex items-center text-[11px] text-gray-400">
                {icon}
                {data}
            </span>
            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block">
                <div className="bg-gray-700 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    {text}
                </div>
                <div className="w-2 h-2 bg-gray-700 transform rotate-45 translate-x-2 -translate-y-1"></div>
            </div>
        </div>
    )
}

export default Tooltip 