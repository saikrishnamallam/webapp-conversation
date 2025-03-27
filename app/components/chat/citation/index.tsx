import { useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { CitationItem } from '../type'
import Popup from './popup'

export type Resources = {
    documentId: string
    documentName: string
    dataSourceType: string
    sources: CitationItem[]
}

type CitationProps = {
    data: CitationItem[]
    showHitInfo?: boolean
    containerClassName?: string
}

const Citation: FC<CitationProps> = ({
    data,
    showHitInfo,
    containerClassName = 'chat-answer-container',
}) => {
    const { t } = useTranslation()
    const elesRef = useRef<HTMLDivElement[]>([])
    const [limitNumberInOneLine, setLimitNumberInOneLine] = useState(0)
    const [showMore, setShowMore] = useState(false)

    const resources = useMemo(() => data.reduce((prev: Resources[], next) => {
        const documentId = next.document_id || ''
        const documentName = next.document_name
        const dataSourceType = next.data_source_type || 'file'

        const documentIndex = prev.findIndex(i => i.documentName === documentName)

        if (documentIndex > -1) {
            const contentExists = prev[documentIndex].sources.some(
                source => source.content === next.content
            )

            if (!contentExists) {
                prev[documentIndex].sources.push(next)
            }
        }
        else {
            prev.push({
                documentId,
                documentName,
                dataSourceType,
                sources: [next],
            })
        }

        return prev
    }, []), [data])

    const handleAdjustResourcesLayout = () => {
        const container = document.querySelector(`.${containerClassName}`)
        if (!container) return

        const containerWidth = container.clientWidth - 40
        let totalWidth = 0

        for (let i = 0; i < resources.length; i++) {
            if (!elesRef.current[i]) continue

            totalWidth += elesRef.current[i].clientWidth

            if (totalWidth + i * 4 > containerWidth) {
                totalWidth -= elesRef.current[i].clientWidth

                if (totalWidth + 34 > containerWidth)
                    setLimitNumberInOneLine(i - 1)
                else
                    setLimitNumberInOneLine(i)

                break
            }
            else {
                setLimitNumberInOneLine(i + 1)
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            handleAdjustResourcesLayout()
        }, 0)
    }, [resources])

    const resourcesLength = resources.length

    return (
        <div className='-mb-1 mt-3'>
            <div className='text-xs font-medium mb-2 flex items-center text-gray-500'>
                {t('Citations', { defaultValue: 'Citations' })}
                <div className='ml-2 h-[1px] grow bg-gray-200' />
            </div>
            <div className='relative flex flex-wrap'>
                {
                    resources.map((res, index) => (
                        <div
                            key={`measure-${index}`}
                            className='absolute left-0 top-0 -z-10 mb-1 mr-1 h-7 w-auto max-w-[240px] whitespace-nowrap pl-7 pr-2 text-xs opacity-0'
                            ref={(ele: any) => (elesRef.current[index] = ele!)}
                        >
                            {res.documentName}
                        </div>
                    ))
                }
                {
                    resources.slice(0, showMore ? resourcesLength : limitNumberInOneLine).map((res, index) => (
                        <div key={`citation-${index}`} className='mb-1 mr-1 cursor-pointer'>
                            <Popup
                                data={res}
                                showHitInfo={showHitInfo}
                            />
                        </div>
                    ))
                }
                {
                    limitNumberInOneLine < resourcesLength && (
                        <div
                            className='text-xs font-medium flex h-7 cursor-pointer items-center rounded-lg bg-gray-100 px-2 text-gray-500'
                            onClick={() => setShowMore(v => !v)}
                        >
                            {
                                !showMore
                                    ? `+ ${resourcesLength - limitNumberInOneLine}`
                                    : <span className='transform rotate-180'>↓</span>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Citation 