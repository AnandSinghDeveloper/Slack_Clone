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

interface signUpCardProps {
  setState: (state: SignInFlow) => void;
}
export function SignUpCard({ setState }: signUpCardProps) {
  const [password, SetPassword] = React.useState("");
  const [email, SetEmail] = React.useState("");
  const [confirmPassword, SetConfirmPassword] = React.useState("");
  const [name, SetName] = React.useState("");
 
  const [error, setError] = useState("");
  const [panding, setPanding] = useState(false);
  const { signIn } = useAuthActions();

  const onProviderSignUp = (value: "google" | "github") => {
    setPanding(true);
    signIn(value).finally(() => setPanding(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPanding(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    signIn("password", {  name,  email, password, flow: "signUp" })
      .catch(() => setError("Something went wrong"))
      .finally(() => setPanding(false));
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form submitted");
  // };
  return (
    <div className="shadow-input mx-auto w-full  max-w-md rounded-none sm:rounded-2xl bg-white p-4 md:rounded-2xl md:p-7 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 flex gap-2.5">
        Let's Join Slack <Image src={logo} alt="logo" width={30} height={10} />
      </h2>
      {!!error && (
        <div className=" bg-destructive/15 rounded-md p-3 flex items-center gap-x-2 text-destructive text-sm  mt-2 ">
          <TriangleAlert size={20} />
          <p>{error}</p>
        </div>
      )}

      <form className="my-3" onSubmit={onPasswordSignUp}>
        <div className="mb-2 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">Full name</Label>
            <Input
              required
              value={name}
              onChange={(e) => SetName(e.target.value)}
              id="firstname"
              placeholder="Full Name"
              type="text"
            />
          </LabelInputContainer>
          
        </div>

        <LabelInputContainer className="mb-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            required
            id="email"
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-2">
          <Label htmlFor="password">Password</Label>
          <Input
            required
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="ConfirmPassword">Confirm Password</Label>
          <Input
            required
            value={confirmPassword}
            onChange={(e) => SetConfirmPassword(e.target.value)}
            id="ConfirmPassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          {
            panding && panding ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className=" mx-2 text-muted-foreground ">Signing up...</span>
              </div>
            ):<span> Sign up &rarr;</span>
          }
         
          <BottomGradient />
        </button>

        <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            disabled={panding}
            onClick={() => onProviderSignUp("github")}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <FaGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            disabled={panding}
            onClick={() => onProviderSignUp("google")}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
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
        Already have an account?{" "}
        <span
          onClick={() => setState("signIn")}
          className=" text-sky-700 hover:underline cursor-pointer"
        >
          {" "}
          SignIn
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
