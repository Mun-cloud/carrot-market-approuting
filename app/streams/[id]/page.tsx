import getSession from "@/lib/session";

import { notFound } from "next/navigation";
import StreamEditBtns from "./_components/stream-edit-btns";
import { getStream } from "./actions";
import NavHeader from "@/components/nav-header";
import StreamingPlayer from "@/components/streaming_player";
import UserAvatar from "@/components/user-avatar";
import StreamMessages from "./_components/stream-messages";

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
    <div className="min-h-screen flex flex-col">
      <NavHeader>{stream.title}</NavHeader>
      <div className="relative aspect-video">
        <StreamingPlayer
          videoId={stream.replay_id ? stream.replay_id : stream.stream_id}
        />
      </div>
      <div className="flex items-center justify-between p-5 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden">
            <UserAvatar
              avatar={stream.user.avatar}
              username={stream.user.username}
            />
          </div>
          <div className="">
            <h3>{stream.user.username}</h3>
          </div>
        </div>
        {stream.userId === session.id! && (
          <StreamEditBtns
            id={id}
            streamId={stream.stream_id}
            isEnded={!!stream.replay_id}
          />
        )}
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>

      {/* 스트리밍 소유자에게만 보여짐 */}
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

      <StreamMessages />
    </div>
  );
};

export default StreamDetailPage;
