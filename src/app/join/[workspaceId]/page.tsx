"use client";
import Image from "next/image";
import logo from "../../../../public/1707837044slack-icon-png.png";
import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { getUserWorkspaceInfo } from "@/app/Features/workSpaces/api/useGetWorkspaceInfo";
import { TbLoader3 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useJoin } from "@/app/Features/workSpaces/api/useJoin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";


const JoinPage = () => {
  const workspaceId =useWorkspaceId();
  const { data , isLoading}= getUserWorkspaceInfo({id:workspaceId})
  const router = useRouter();
  const { mutate, isPanding}= useJoin();

  const isMember= useMemo(()=>data?.isMember, [data?.isMember]);

 
  useEffect(()=>{
    if(isMember){
      router.push(`/workspace/${workspaceId}`)
    }
  },[isMember,workspaceId,router])

  const handleComplete =  (value: string) => {
    mutate({ workspaceId: workspaceId, joincode: value },{
      OnSuccess:(id)=>{
        router.push(`/workspace/${id}`)
        toast.success("Workspace joined successfully");
      },
      OnError:()=>toast.error("Failed to join workspace"),
    });
  }

  if(isLoading){
    return (
      <div className="h-full flex items-center justify-center ">
      <TbLoader3 className="text-[#5e2c5f] size-7 animate-spin " />
      </div>
    )
  }
  return (
    <div className="h-full flex  flex-col gap-y-8  items-center justify-center rounded-md bg-white p-8">
      <Image src={logo} alt="logo" width={60} height={60} />
      <div className=" max-w-md flex flex-col gap-y-4 justify-center items-center ">
        <div className=" flex flex-col gap-y-2 justify-center items-center">
          <h1 className=" text-2xl font-bold text-center">Join {data?.name}</h1>
          <p className="text-muted-foreground text-md ">
            Enter the invite code to join the workspace
          </p>
        </div>
        <VerificationInput
        onComplete={handleComplete}
        length={6}
          classNames={{
            container: cn("flex flex-row gap-x-2 " , isPanding && "opacity-50  cursor-not-allowed " ),
            character: " uppercase rounded-md h-auto border border-gray-300 text-lg font-medium flex items-center justify-center text-gray-500 ",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled : "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className=" flex gap-x-4">
           <Button variant={"outline"} size={"lg"} asChild>
            

             <Link href="/"> Back To Home</Link>
           </Button>
      </div>
    </div>
  );
};

export default JoinPage;
