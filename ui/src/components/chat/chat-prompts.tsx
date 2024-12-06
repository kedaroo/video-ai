import React from 'react'
import IssueIcon from '../../assets/issue.svg'
import InfoIcon from '../../assets/info.svg'

const SAMPLE_CHAT_PROMPTS = [
  {
    prompt: 'What are the residents\' complains?',
    icon: IssueIcon,
  },
  {
    prompt: 'Summarise the chat for today',
    icon: InfoIcon,
  },
]

interface IChatPrompts {
  handlePrompting: (prompt: string) => Promise<void>;
}

const ChatPrompts = (props: IChatPrompts) => {
  return (
    <div className='flex gap-4 flex-1 items-center justify-center'>
      {SAMPLE_CHAT_PROMPTS.map((prompt, idx) => (
        <ChatPromptOption
          onClick={() => props.handlePrompting(prompt.prompt)}
          prompt={prompt.prompt}
          icon={prompt.icon}
          key={idx}
        />
      ))}
    </div>
  )
}

interface IChatPromptOption {
  prompt: string;
  icon: string;
  onClick: () => void;
}

const ChatPromptOption = (props: IChatPromptOption) => {
  return (
    <div 
      className='w-56 hover:bg-neutral-100 transition-all flex flex-col items-start gap-2 p-3 rounded-xl border cursor-pointer'
      onClick={props.onClick}
    >
      <img src={props.icon} alt='prompt icon' className='h-4 opacity-75' />
      <p className='text-neutral-500'>
        {props.prompt}
      </p>
    </div>
  )
}

export default ChatPrompts