"use client"
import dynamic from "next/dynamic"



const Editor = dynamic(() => import("@/app/Components/Editor"), { ssr: false })

const ChatInput = () => {
  return (
    <div className="px-5 w-full">
      <Editor varient="create" onSubmit={()=>{}} />
    </div>
  )
}

export default ChatInput
