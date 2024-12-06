import React from 'react'
import ChatMessage, { TChatMessage } from './chat-message'
import ChatSkeletonLoader from './chat-skeleton-loader';

interface IChatHistory {
  chatHistory: TChatMessage[];
  streamedResponse: string;
  showSkeletonLoader: boolean;
  chatHistoryConRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory = (props: IChatHistory) => {

  return (
    <div ref={props.chatHistoryConRef} className='flex-1 py-4 overflow-y-auto'>
      <div className='flex flex-col container max-w-screen-md mx-auto gap-4'>
        {props.chatHistory.map((msg, idx) => {
          return (
            <ChatMessage key={idx} msg={msg} /> 
          )
        })}
        <ChatMessage msg={{role: 'assistant', message: props.streamedResponse}} /> 
        {props.showSkeletonLoader && <ChatSkeletonLoader />}
      </div>
    </div>
  )
}

export default ChatHistory