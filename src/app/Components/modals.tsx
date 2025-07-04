"use client";

import { useEffect, useState } from "react";

import CreateWorkspaceModel from "../Features/workSpaces/components/createWorkspaceModel";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <CreateWorkspaceModel />
    </>
  );
};

export default Modals;
