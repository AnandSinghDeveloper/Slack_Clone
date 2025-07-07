import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import WorkSpceSidebar from "./WorkSpceSidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
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
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
