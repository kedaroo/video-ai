import React, { useEffect, useRef, useState } from 'react'
import ChatInput from '../components/chat/chat-input'
import ChatHistory from '../components/chat/chat-history'
import { TChatMessage } from '../components/chat/chat-message'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import ChatPrompts from '../components/chat/chat-prompts'

const ChatLayout = () => {
  const [chatHistory, setChatHistory] = useState<TChatMessage[]>([])
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [response, setResponse] = useState("");
  const [showSkeletonLoader, setShowSkeletonLoader] = useState(false)
  const chatHistoryConRef = useRef<HTMLDivElement>(null)

  const handlePrompting = async (prompt: string) => {
    setChatHistory(prevHistory => ([...prevHistory, { role: 'user', message: prompt }]))

    setShowSkeletonLoader(true)

    const res = await fetch('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })

    setShowSkeletonLoader(false)

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let finalResponse = ''

    if (reader) {
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          try {
            const parsedData = JSON.parse(chunk.trim().split('\n').pop() || '{}');
            finalResponse = finalResponse + parsedData
            setResponse(finalResponse);
          } catch (error) {
            console.error("Error parsing chunk", error);
          }
        }
      }
    }

    setResponse('')

    setChatHistory(prevHistory => ([...prevHistory, { role: 'assistant', message: finalResponse }]))

    setIsInputDisabled(false)
  }

  const onChatMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsInputDisabled(true)

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const prompt = formData.get('prompt') as string
    form.reset()

    if (!prompt) return

    handlePrompting(prompt)
  }

  useEffect(() => {
    if (chatHistoryConRef.current) {
      chatHistoryConRef.current.scrollTop = chatHistoryConRef.current.scrollHeight
    }
  }, [response, chatHistory])

  return (
    <div
      className='w-full h-screen flex'
    >
      <Sidebar />
      
      <div className='flex-1 flex flex-col p-4'>
        <Header />

        {chatHistory.length < 1 ? (
          <ChatPrompts handlePrompting={handlePrompting} />
        ) : (
          <ChatHistory
            streamedResponse={response}
            chatHistory={chatHistory}
            showSkeletonLoader={showSkeletonLoader}
            chatHistoryConRef={chatHistoryConRef}
          />
        )}

        <ChatInput
          isInputDisabled={isInputDisabled}
          onSubmit={onChatMessageSubmit}
        />
      </div>
    </div>
  )
}

export default ChatLayout