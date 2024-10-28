import type { FC } from 'react'

type LogoEmbededChatHeaderProps = {
  className?: string
  src?: string
}
const LogoEmbededChatHeader: FC<LogoEmbededChatHeaderProps> = ({
  className,
  src,
}) => {
  return (
    <img
      src={src || '/logo/logo-embeded-chat-header.png'}
      className={`block w-auto h-[40px] ${className}`}
      alt="logo"
    />
  )
}

export default LogoEmbededChatHeader
