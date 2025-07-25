"use client";
import React from "react";
import { Label } from "../../../Components/ui/label";
import { Input } from "../../../Components/ui/input";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import logo from "../../../../../public/1707837044slack-icon-png.png";
import { SignInFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export function SignInCard({ setState }: SignInCardProps) {
  const [password, SetPassword] = useState("");
  const [email, SetEmail] = useState("");
  const [error, setError] = useState("");
  const [panding, setPanding] = useState(false);
  const { signIn } = useAuthActions();

  const onProviderSignIn = (value: "google" | "github") => {
    setPanding(true);
    signIn(value).finally(() => setPanding(false));
  };

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPanding(true);
    signIn("password", { email, password , flow: "signIn" })
    .catch(() => setError("Invalid email or password"))
    .finally(() => setPanding(false));
  }
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form submitted");
  // };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
     
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 w-full flex gap-2.5">
        Welcome to Slack <Image src={logo} alt="logo" width={30} height={10} />
      </h2>
        {!!error && <div className=" bg-destructive/15 rounded-md p-3 flex items-center gap-x-2 text-destructive text-sm mb-3 mt-3 " >
        <TriangleAlert  size={20}/>
        <p>{error}</p></div>}
        
      <form className="my-8" onSubmit={onPasswordSignIn}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
          required
          disabled={panding}
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
          required
            disabled={panding}
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          disabled={panding}
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
           {
            panding && panding ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className=" mx-2 text-muted-foreground ">Signing in...</span>
              </div>
            ):<span> Sign in &rarr;</span>
          }
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            disabled={panding}
            onClick={() => onProviderSignIn("github")}
            className="group/btn cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
          >
            <FaGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Github
            </span>
            <BottomGradient />
          </button>

          <button
           disabled={panding}
            onClick={() => onProviderSignIn("google")}
            className="group/btn cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
          >
            <FcGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>

      <p className=" text-sm font-medium text-muted-foreground">
        {" "}
        Don't have an account?{" "}
        <span
          onClick={() => setState("signUp")}
          className=" text-sky-700 hover:underline cursor-pointer"
        >
          {" "}
          SignUP
        </span>
      </p>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
