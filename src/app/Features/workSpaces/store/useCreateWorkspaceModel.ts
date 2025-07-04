import { atom, useAtom } from "jotai";

const modalState = atom(false);
export const createWorkspaceModalAtom = () => {
  return useAtom(modalState);
};
