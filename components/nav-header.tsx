import Link from "next/link";
import NavBackBtn from "./nav-back-btn";

interface NavHeaderProps {
  children: React.ReactNode;
  href?: string;
}
const NavHeader = ({ children, href }: NavHeaderProps) => {
  return (
    <div className="flex bg-neutral-800 relative items-center justify-center w-full py-2 text-[14px]">
      {href ? (
        <Link
          className="block absolute top-1/2 -translate-y-1/2 left-4 rounded-full hover:bg-neutral-500 p-1"
          href={href}
        ></Link>
      ) : (
        <NavBackBtn />
      )}
      <div className="max-w-[50%] line-clamp-1">{children}</div>
    </div>
  );
};

export default NavHeader;
