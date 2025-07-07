"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface HintProps{
 label: string ,
 children: React.ReactNode,
 align? : "start" | "center" | "end",
 side? : "top" | "right" | "bottom" | "left"
}

export const Hint = ({label,children,align,side}:HintProps)=>{
return(
  <TooltipProvider>
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent align={align} side={side} className=" bg-black text-white border border-white/5" >
         <p className=" text-xs font-medium">
            {label}
         </p>
      </TooltipContent>

    </Tooltip>

  </TooltipProvider>
)
}

