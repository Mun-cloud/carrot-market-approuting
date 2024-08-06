"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NavHeader = ({ children }: { children?: React.ReactNode }) => {
  const { back } = useRouter();
  return (
    <div className="flex bg-neutral-800 relative items-center justify-center w-full py-2 text-[14px]">
      <button
        className="absolute top-1/2 -translate-y-1/2 left-4 rounded-full hover:bg-neutral-500 p-1"
        type="button"
        onClick={() => back()}
      >
        <ArrowLeftIcon className="size-5" />
      </button>

      {children}
    </div>
  );
};

export default NavHeader;
