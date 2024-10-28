import type { FC } from 'react'
import React from 'react'
import {
  Spinner as RSpinner,
} from "@radix-ui/themes";
type Props = {
  loading?: boolean
  className?: string
  children?: React.ReactNode | string
}

const Spinner: FC<Props> = ({ loading = false, children, className }) => {
  return (
    <div className='flex w-100% justify-evenly'>
      <div
        className={`inline-block text-gray-200 h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${loading ? 'motion-reduce:animate-[spin_1.5s_linear_infinite]' : 'hidden'} ${className ?? ''}`}
        role="status"
      >
        <RSpinner />
        {children}
      </div>
    </div>
  )
}

export default Spinner
