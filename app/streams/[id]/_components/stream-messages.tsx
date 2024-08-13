"use client";

import {
  STREAM_EVENT_NAME,
  SUPABASE_PUBLIC_KEY,
  SUPABASE_URL,
} from "@/lib/constants";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StreamMessagesProps {
  streamId: number;
}

const StreamMessages = ({ streamId }: StreamMessagesProps) => {
  const [messages, setMessages] = useState();
  const channel = useRef<RealtimeChannel>();

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`stream-messages-${streamId}`);
    channel.current
      .on("broadcast", { event: STREAM_EVENT_NAME }, (payload) => {
        console.log(payload);
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [streamId]);
  return (
    <div className="grow pb-[50px] relative">
      <div className="h-full overflow-y-auto"></div>
      <div className="absolute bottom-0 w-full left-0 border-t h-[50px] flex items-center justify-center gap-3">
        <input
          className="w-[80%] h-[35px] border rounded-full px-3 bg-transparent text-[14px] focus:outline-none ring-1 focus:border-orange-500 peer"
          required
          minLength={1}
        />
        <button className="bg-neutral-400 py-1 px-2 rounded-full peer-valid:bg-orange-400 peer-valid:*:text-secondary">
          <SendIcon className="size-[20px] text-neutral-500" />
        </button>
      </div>
    </div>
  );
};

export default StreamMessages;
