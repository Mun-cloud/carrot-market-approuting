import AddLink from "@/components/add-link";
import db from "@/lib/db";
import { href } from "@/lib/href";
import { formatToTimeAgo } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

async function getStreams() {
  const streams = await db.liveStream.findMany({
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      stream_id: true,
      replay_id: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return streams;
}

const LivePage = async () => {
  const streams = await getStreams();
  return (
    <div className="flex flex-col">
      {streams?.map((stream) => (
        <Link
          className="py-5 px-4 border-b last:border-b-0 flex gap-3 text-white"
          href={`${href.stream.stream}/${stream.id}`}
          key={stream.id}
        >
          <div className="aspect-video h-[80px]">
            <Image
              src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.replay_id}/thumbnails/thumbnail.jpg`}
              alt={stream.title}
              width={142}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grow flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <p className="font-bold line-clamp-1">{stream.title}</p>
              <span className="text-[12px] text-white/50">
                {formatToTimeAgo(stream.created_at.toString())}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Image
                src={stream.user.avatar!}
                alt={stream.user.username}
                className="aspect-square size-[20px] object-cover rounded-xl"
                width={50}
                height={50}
              />
              <span className="text-[12px]">{stream.user.username}</span>
            </div>
          </div>
        </Link>
      ))}
      <AddLink href={href.stream.add} />
    </div>
  );
};

export default LivePage;
