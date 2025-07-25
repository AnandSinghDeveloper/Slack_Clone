"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import WorkSpceSidebar from "./WorkSpceSidebar";
import { usePanel } from "@/app/hooks/usePanel";
import { TbLoader3 } from "react-icons/tb";
import Thread from "@/app/Features/messages/components/Thread";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  const { parentMessageId, onclose } = usePanel();

  const showPanel = !!parentMessageId;

  return (
    <div className="h-full ">
      <Toolbar />
      <div className=" flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId={"workspace"}>
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className=" bg-[#5e2c5f]"
          >
            <WorkSpceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={27} className="">
                {parentMessageId ? (
                  <Thread
                  messageId={parentMessageId as Id<"messages">}
                  onclose={onclose}
                  />
                ) : (
                  <div className=" h-full flex items-center justify-center">
                    <TbLoader3 className=" animate-spin size-5 text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
