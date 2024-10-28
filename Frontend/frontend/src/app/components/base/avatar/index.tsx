'use client'
import { useState } from 'react'
import cn from '@/utils/classnames'
import { Avatar as RadixAvatar, AvatarProps as RadixProps} from '@radix-ui/themes'
type AvatarProps = {
  avatar?: string
  className?: string
  textClassName?: string
} & RadixProps
const Avatar = ({
  avatar,
  size = '5',
  className,
  textClassName,
  ...props
}: AvatarProps) => {
  const avatarClassName = 'shrink-0 flex items-center rounded-full bg-primary-600'
  const style = { width: `${size}px`, height: `${size}px`, fontSize: `${size}px`, lineHeight: `${size}px` }
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    setImgError(true)
  }

  if (avatar && !imgError) {
    return (
      <RadixAvatar src={avatar} onError={handleError} className={cn(avatarClassName, className)} {...props}/>
    )
  }

  return (
    <div
      className={cn(avatarClassName, className)}
      style={style}
    >
      <div
        className={cn(textClassName, 'text-center text-white scale-[0.4]')}
        style={style}
      >
        {props.fallback.toString().toLocaleUpperCase()}
      </div>
    </div>
  )
}

export default Avatar