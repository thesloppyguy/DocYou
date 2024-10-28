import type { FC } from 'react'
// import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

type DateInputProps = {
  placeholder?: string
  className?: string
  value: string
  onChange: (v: string) => void
  white?: boolean
  min?: string
  max?: string
}
const DateInput: FC<DateInputProps> = ({
  className,
  value,
  onChange,
  white,
  min,
  max,
}) => {
  const { t } = useTranslation()
  return (
    <div className={cn(
      'group flex items-center px-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-transparent overflow-hidden',
      white && '!bg-white hover:!bg-white shawdow-xs !border-gray-300 hover:!border-gray-300',
      className,
    )}>
      <input type="date" className='bg-transparent text-[14px] text-gray-700' onChange={e => onChange(e.target.value)} value={value} min={min} max={max}/>
    </div>
  )
}

export default DateInput
