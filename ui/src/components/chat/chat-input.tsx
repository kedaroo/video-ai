import React from 'react'
import Loader from './loader';
import SendIcon from '../../assets/send.svg'

interface IChatInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isInputDisabled: boolean;
}

const ChatInput = (props: IChatInputProps) => {
  return (
    <form 
      className='max-w-screen-md container mx-auto border flex justify-between p-1 rounded-lg w-full'
      onSubmit={props.onSubmit}
    >
      <input 
        type='text' 
        className='w-full focus:outline-none pl-2' 
        name='prompt'
        autoComplete='off'
        placeholder='Ask me anything about current ongoings in your society'
      />

      <button 
        disabled={props.isInputDisabled}
        type='submit'
        className='text-white bg-neutral-800 p-1 rounded-lg disabled:bg-neutral-200 h-10 w-10 flex justify-center items-center'
      >
        {props.isInputDisabled ? <Loader /> : <img src={SendIcon} alt='send icon' className='invert h-6' />}
      </button>
    </form>
  )
}

export default ChatInput

