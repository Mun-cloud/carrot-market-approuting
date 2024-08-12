"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NavBackBtn = () => {
  const { back } = useRouter();
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 left-4 rounded-full hover:bg-neutral-500 p-1"
      type="button"
      onClick={back}
    >
      <ArrowLeftIcon className="size-5" />
    </button>
  );
};

export default NavBackBtn;
