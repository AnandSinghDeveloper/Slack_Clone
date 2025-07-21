
"use client"


import { Joan } from "next/font/google"
import { useGetMessagesRequestType } from "../Features/messages/api/useGetMessages"
import { format, isToday, isYesterday } from "date-fns"

interface MessageListProps {
  memberName?: string,
  memberImage?: string,
  channelName?: string,
  channelCreationTime?: number,
  variant?: "channel" | "thread" | "conversation"
  data: useGetMessagesRequestType | undefined
  loadMore: () => void,
  isLoadingMore: boolean,
  canLoadMore: boolean

}


  const formatDateLabel = (dateKey: string) => {
    const date = new Date(dateKey)
    if(isToday(date)){
      return "Today"
    }
    if(isYesterday(date)){
      return "Yesterday"
    }
    return format(date, "EEEE-MMMM d")
  }

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore
}: MessageListProps) => {



  const groupedMessages= data?.reduce((groups , messages)=>{
    const date = new Date(messages._creationTime) 
    const dateKey = format(date, "yyyy-MM-dd")

    if(!groups[dateKey]){
      groups[dateKey] = []
    }

    groups[dateKey].unshift(messages)

    return groups
  }, {} as Record<string, typeof data>

)
  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {
        Object.entries(groupedMessages || {}).map(([dateKey , messages])=>(
          <div key={dateKey}>
            <div className=" text-center my-2 relative">
              <hr className="absolute border-t left-0 right-0 top-1/2 border-gray-300" />
              <span className={"relative inline-block bg-background px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"}>
                {formatDateLabel(dateKey)}
              </span>
            </div>
              {
                messages.map((message , index)=>{
                  return (
                    <div key={message._id}>
                      {JSON.stringify(message)}
                    </div>
                  )
                })
                }
          </div>
        ))
      }
    </div>
  )
}

export default MessageList
