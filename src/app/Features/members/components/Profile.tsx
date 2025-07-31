"use client";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/useGetMember";
import { ChevronDownIcon, MailIcon, TriangleAlert, XIcon } from "lucide-react";
import { TbLoader3 } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpadateMember } from "../api/useUpdateMember";
import { useRemoveMember } from "../api/useRemoveMember";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { useCuerrntMember } from "../api/useCuerrntMember";
import { toast } from "sonner";
import useConfirm from "@/app/hooks/useConfirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [LeaveDailog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [RemoveDailog, confirmRemove] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member?"
  );
  const [UpdateDailog, confirmUpdate] = useConfirm(
    "Change Role",
    "Are you sure you want to change this member role?"
  );

  const { data: currentMember, isLoading: currentMemberLoading } =
    useCuerrntMember({ workspaceId });
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { mutate: updateMember, isPanding: updateLoading } = useUpadateMember();
  const { mutate: removeMember, isPanding: removeLoading } = useRemoveMember();

  const onRemove = async () => {
    const isConfirmed = await confirmRemove();
    if (!isConfirmed) return;
    removeMember(
      { id: memberId },
      {
        OnSuccess() {
          toast.success("Member removed successfully");
          onClose();
        },
        OnError(error) {
          toast.error("Failed to remove member");
        },
      }
    );
  };
  const onLeave = async () => {
    const isConfirmed = await confirmLeave();
    if (!isConfirmed) return;
    removeMember(
      { id: memberId },
      {
        OnSuccess() {
          toast.success("You left the workspace successfully");
          router.replace("/");
          onClose();
        },
        OnError(error) {
          toast.error("Failed to leave member");
        },
      }
    );
  };
  const onUpdate = async (role: "admin" | "member") => {
    const isConfirmed = await confirmUpdate();
    if (!isConfirmed) return;
    updateMember(
      { id: memberId, role },
      {
        OnSuccess() {
          toast.success("Role Changed successfully");
          onClose();
        },
        OnError(error) {
          toast.error("Failed to update member");
        },
      }
    );
  };

  if (memberLoading || currentMemberLoading) {
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex items-center justify-between h-[49px] px-4 border-b">
          <p className="font-bold text-lg"> Profile</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-black hover:bg-gray-100/70"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
          <TbLoader3 className="text-[#5e2c5f] animate-spin size-5  " />
        </div>
      </div>
    );
  }

  if (!member)
    return (
      <div className=" h-full flex flex-col">
        <div className=" flex items-center justify-between h-[49px] px-4 border-b">
          <p className="font-bold text-lg"> Profile</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-black hover:bg-gray-100/70"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className=" h-full flex flex-col gap-y-2 items-center justify-center">
          <TriangleAlert className="text-[#5e2c5f] size-7  " />
          <p className=" text-[#5e2c5f] text-sm ">Profile not found</p>
        </div>
      </div>
    );

  return (
    <>
      <RemoveDailog />
      <LeaveDailog />
      <UpdateDailog />
      <div className=" h-full flex flex-col">
        <div className=" flex items-center justify-between h-[49px] px-4 border-b">
          <p className="font-bold text-lg"> Profile</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-black hover:bg-gray-100/70"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className=" p-4 flex flex-col items-center justify-center">
          <Avatar className=" size-full max-w-[250px] max-h-[250px] rounded-xl border-4 border-white dark:border-gray-700 shadow-sm ring-3 ring-gray-100 dark:ring-gray-800 transition-all duration-200 hover:shadow-md hover:ring-gray-200 dark:hover:ring-gray-600">
            <AvatarImage
              className="rounded-xl object-cover"
              src={member.user?.image!}
            />
            <AvatarFallback className=" aspect-square  rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold text-6xl shadow-inner">
              {member.user?.name!.charAt(0).toUpperCase() ?? "M"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className=" flex flex-col p-4">
          <p className=" text-lg font-bold mb-4">{member.user?.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className=" flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className=" w-[8vw] capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) => {
                      onUpdate(role as "admin" | "member");
                    }}
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                variant={"outline"}
                className=" w-[8vw] capitalize"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div>
              <Button
                onClick={onLeave}
                variant={"outline"}
                className={" w-full"}
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className=" flex flex-col p-4">
          <p className=" text-lg font-bold mb-4">Contact infromation </p>
          <div className=" flex items-center gap-2">
            <div className=" size-9 flex items-center rounded-md justify-center bg-muted">
              <MailIcon className=" size-5 stroke-1.5" />
            </div>
            <div className="flex flex-col">
              <p className=" text-[13px ] text-muted-foreground font-semibold ">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user?.email}`}
                className=" text-sm hover:underline text-[#1264a3]  truncate "
              >
                {member.user?.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
