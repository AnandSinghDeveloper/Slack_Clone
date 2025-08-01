"use client";
import React from "react";
import { SignInFlow } from "../types";
import { useState } from "react";
import {SignInCard} from "./SignInCard";
import {SignUpCard} from "./SignUpCard";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md:w-[420px]">
       {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
      </div>
    </div>
  );
};

export default AuthScreen;
