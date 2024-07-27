import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getStream(id: number) {
  return await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_id: true,
      stream_key: true,
      userId: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
}

const StreamDetailPage = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const stream = await getStream(id);
  if (!stream) {
    notFound();
  }
  const session = await getSession();
  return (
    <div>
      <div className="relative aspect-video">
        <iframe
          //   src={`https://${process.env.CLOUDFLARE_DOMAIN}/${process.env.CLOUDFLARE_ACCOUNT_ID}/iframe`}
          src="https://customer-kes62bzmn6r4hvng.cloudflarestream.com/7eb4070421a85b9101ec4dee4b616f66/iframe"
          title="Example Stream video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="flex items-center justify-between p-5 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden">
            {stream.user.avatar !== null ? (
              <Image
                className="object-fill"
                src={stream.user.avatar}
                alt={stream.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon className="size-10" />
            )}
          </div>
          <div className="">
            <h3>{stream.user.username}</h3>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>

      {stream.userId === session.id! ? (
        <div className="bg-yellow-200 text-black p-5 rounded-md">
          <div className="flex gap-2">
            <span className="font-semibold">Stream URL:</span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex  flex-wrap">
            <span className="font-semibold">Secret Key:</span>
            <span className="break-all">{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StreamDetailPage;
