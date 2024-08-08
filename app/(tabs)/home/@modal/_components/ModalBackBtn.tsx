"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const ModalBackBtn = () => {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  return (
    <button
      onClick={onCloseClick}
      className="absolute right-[3vw] top-5 text-neutral-200 size-10"
    >
      <XMarkIcon />
    </button>
  );
};

export default ModalBackBtn;
