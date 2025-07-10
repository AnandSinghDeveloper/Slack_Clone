"use client";

import { useEffect, useState } from "react";

import CreateWorkspaceModel from "../Features/workSpaces/components/createWorkspaceModel";
import CreateChannelModel from "../Features/channels/components/CreateChannelModel";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <CreateChannelModel />
      <CreateWorkspaceModel />
    </>
  );
};

export default Modals;
