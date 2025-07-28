" use client ";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ThreadBarProps {
  count?: number;
  image?: string;
  name?: string;
  timeStamp?: number;
  onClick?: () => void;
}

const ThreadBar = ({ count, image, timeStamp, onClick ,name }: ThreadBarProps) => {
  if (!count || !timeStamp) return null;

  return (
    <button
      onClick={onClick}
      className="border border-transparent hover:bg-white p-1  hover:border-border flex items-center  rounded-md  justify-start group/thread-bar transition w-[50%]"
    >
      <div className=" flex items-center gap-2 overflow-hidden ">
        <Avatar className=" size-6 rounded-xl border-2 border-white dark:border-gray-700 shadow-sm ring-2 ring-gray-100 dark:ring-gray-800 transition-all duration-200 hover:shadow-md hover:ring-gray-200 dark:hover:ring-gray-600">
          <AvatarImage className="rounded-xl object-cover" src={image!} />
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold text-sm shadow-inner">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className=" text-xs hover:underline text-sky-700 font-bold truncate">
          {count}
          {count > 1 ? " replies" : " reply"}
        </span>
        <span className=" text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block ">
          Last replied {formatDistanceToNow(timeStamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View theads
        </span>
      </div>
    </button>
  );
};

export default ThreadBar;
