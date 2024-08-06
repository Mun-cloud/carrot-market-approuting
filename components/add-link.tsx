import { PlusIcon } from "lucide-react";
import Link from "next/link";

const AddLink = ({ href }: { href: string }) => {
  return (
    <Link
      href={href}
      className="bg-orange-500 flex items-center justify-center rounded-full size-12 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
    >
      <PlusIcon className="size-9" />
    </Link>
  );
};

export default AddLink;
