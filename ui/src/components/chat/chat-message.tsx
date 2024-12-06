import React from 'react'
import Markdown from 'react-markdown';

export type TChatMessage = {
  message: string,
  role: 'user' | 'assistant',
}

interface IChatMessageProps {
  msg: TChatMessage;
}

const ChatMessage = (props: IChatMessageProps) => {
  const bg = props.msg.role === 'assistant' ? 'bg-transparent' : 'bg-neutral-200'
  const width = props.msg.role === 'assistant' ? 'w-full' : 'max-w-3/4'

  return (
    <div className={`${bg} px-3 py-2 rounded-lg ${width} self-end`}>
      <Markdown>{props.msg.message}</Markdown>
    </div>
  )
}

export default ChatMessage