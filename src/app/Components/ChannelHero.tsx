"use client"

import { format } from "date-fns"

interface ChannelHeroProps {
   name: string,
   creationTime: number
}
const ChannelHero = ({name, creationTime}: ChannelHeroProps) => {
  return (
    <div className=" mt-[88px] mx-5 mb-4 ">
      <p className="text-2xl font-bold flex items-center mb-2">
       # {name}
      </p>
      <p className="mb-4 text-slate-800 font-normal">
       This channel was created on {format(creationTime, "MMMM do, yyyy")} This is very beginning of the <strong>{name}</strong> channel
       </p>
    </div>
  )
}

export default ChannelHero
