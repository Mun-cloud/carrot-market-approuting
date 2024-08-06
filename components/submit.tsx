"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface SubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const submitVariants = cva("");

const Submit = ({ children, className, ...props }: SubmitProps) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={cn(
        "bg-orange-400 rounded-md py-2 text-black hover:bg-orange-500 hover:text-white transition-colors disabled:bg-white/30 disabled:text-black",
        submitVariants({ className })
      )}
      {...props}
    >
      {pending ? (
        <Loader2 className="size-[20px] animate-spin mx-auto" />
      ) : (
        children
      )}
    </button>
  );
};

export default Submit;
