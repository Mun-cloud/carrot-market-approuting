"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavHeaderProps {
  children: React.ReactNode;
  href?: string;
}
const NavHeader = ({ children, href }: NavHeaderProps) => {
  const { back, push } = useRouter();
  return (
    <div className="flex bg-neutral-800 relative items-center justify-center w-full py-2 text-[14px]">
      <button
        className="absolute top-1/2 -translate-y-1/2 left-4 rounded-full hover:bg-neutral-500 p-1"
        type="button"
        onClick={() => (href ? push(href) : back())}
      >
        <ArrowLeftIcon className="size-5" />
      </button>

      <div className="max-w-[50%] line-clamp-1">{children}</div>
    </div>
  );
};

export default NavHeader;
