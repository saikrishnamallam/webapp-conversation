import { useState, Fragment } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { Resources } from './index'
import Tooltip from './tooltip'
import ProgressTooltip from './progress-tooltip'

type PopupProps = {
    data: Resources
    showHitInfo?: boolean
}

const Popup: FC<PopupProps> = ({
    data,
    showHitInfo = false,
}) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    // Determine file type based on document name extension
    const fileType = data.dataSourceType !== 'notion'
        ? (/\.([^.]*)$/g.exec(data.documentName)?.[1] || '')
        : 'notion'

    // Simple file icon component
    const FileIcon = ({ type, className }: { type: string; className?: string }) => {
        // Map file types to different colors
        const getColor = () => {
            switch (type.toLowerCase()) {
                case 'pdf': return 'text-red-500'
                case 'doc':
                case 'docx': return 'text-blue-500'
                case 'txt': return 'text-gray-500'
                case 'csv':
                case 'xls':
                case 'xlsx': return 'text-green-500'
                case 'notion': return 'text-gray-700'
                default: return 'text-gray-500'
            }
        }

        return (
            <div className={`${getColor()} ${className}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.66667 1.33333H4C3.26667 1.33333 2.66667 1.93333 2.66667 2.66667V13.3333C2.66667 14.0667 3.26667 14.6667 4 14.6667H12C12.7333 14.6667 13.3333 14.0667 13.3333 13.3333V6L8.66667 1.33333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.66667 1.33333V6H13.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        )
    }

    // Simple hash icon
    const HashIcon = ({ className }: { className?: string }) => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M2 4H10M2 8H10M4.5 1L3.5 11M8.5 1L7.5 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    // Simple popup toggler
    const togglePopup = () => {
        setOpen(!open)
    }

    return (
        <div className="relative">
            <div
                className='flex h-7 max-w-[240px] items-center rounded-lg bg-gray-100 px-2 cursor-pointer'
                onClick={togglePopup}
            >
                <FileIcon type={fileType} className='mr-1 h-4 w-4 shrink-0' />
                <div className='truncate text-xs text-gray-500'>{data.documentName}</div>
            </div>

            {open && (
                <div
                    className='fixed top-1/4 left-1/2 transform -translate-x-1/2 max-w-[360px] rounded-xl bg-white shadow-lg z-50'
                    style={{ width: Math.max(280, Math.min(360, data.documentName.length * 8)) }}
                >
                    <div className='px-4 pb-2 pt-3'>
                        <div className='flex h-[18px] items-center'>
                            <FileIcon type={fileType} className='mr-1 h-4 w-4 shrink-0' />
                            <div className='text-xs font-medium truncate text-gray-500'>{data.documentName}</div>
                        </div>
                    </div>

                    <div className='max-h-[450px] overflow-y-auto rounded-lg bg-gray-50 px-4 py-0.5'>
                        <div className='w-full'>
                            {
                                data.sources.map((source, index) => (
                                    <Fragment key={index}>
                                        <div className='group py-3'>
                                            <div className='mb-2 flex items-center justify-between'>
                                                <div className='flex h-5 items-center rounded-md border border-gray-200 px-1.5'>
                                                    <HashIcon className='mr-0.5 h-3 w-3 text-gray-400' />
                                                    <div className='text-[11px] font-medium text-gray-500'>
                                                        {source.segment_position || index + 1}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='break-words text-[13px] text-gray-600'>{source.content}</div>

                                            {showHitInfo && (
                                                <div className='text-xs mt-2 flex flex-wrap items-center text-gray-400'>
                                                    <Tooltip
                                                        text={'Characters'}
                                                        data={source.word_count || 0}
                                                        icon={
                                                            <svg className='mr-1 h-3 w-3' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.33333 1.33333H1.33333C1.15652 1.33333 0.986953 1.40357 0.861929 1.5286C0.736905 1.65362 0.666667 1.82319 0.666667 2V10C0.666667 10.1768 0.736905 10.3464 0.861929 10.4714C0.986953 10.5964 1.15652 10.6667 1.33333 10.6667H10.6667C10.8435 10.6667 11.013 10.5964 11.1381 10.4714C11.2631 10.3464 11.3333 10.1768 11.3333 10V6.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M10.5 0.5C10.6326 0.367392 10.7959 0.292169 10.9667 0.292169C11.1374 0.292169 11.3007 0.367392 11.4333 0.5C11.5659 0.632608 11.6412 0.795859 11.6412 0.966667C11.6412 1.13748 11.5659 1.30073 11.4333 1.43333L6.5 6.36667L5 6.66667L5.3 5.16667L10.5 0.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                    />

                                                    {source.score && (
                                                        <ProgressTooltip data={Number(source.score.toFixed(2))} />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {index !== data.sources.length - 1 && (
                                            <div className='my-1 h-[1px] bg-gray-200' />
                                        )}
                                    </Fragment>
                                ))
                            }
                        </div>
                    </div>

                    <div
                        className="absolute top-0 right-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer -mt-2 -mr-2"
                        onClick={togglePopup}
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 3L3 9M3 3L9 9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            )}

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={togglePopup}
                ></div>
            )}
        </div>
    )
}

export default Popup 