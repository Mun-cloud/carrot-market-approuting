"use client";

import {
  STREAM_EVENT_NAME,
  SUPABASE_PUBLIC_KEY,
  SUPABASE_URL,
} from "@/lib/constants";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";

import { useEffect, useRef, useState } from "react";
import { IStreamMessages } from "../page";
import ChatBubble from "@/components/chat-bubble";
import StreamMessageForm from "./stream-message-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StreamMessagesProps {
  userId: number;
  streamId: number;
  username: string;
  avatar: string;
  initialMessages: IStreamMessages;
}

const StreamMessages = ({
  userId,
  streamId,
  initialMessages,
  username,
  avatar,
}: StreamMessagesProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const channel = useRef<RealtimeChannel>();
  const onSubmit = async (payload: string) => {
    const newMsg = {
      id: Date.now(),
      created_at: new Date(),
      payload,
      user: {
        id: userId,
        username,
        avatar,
      },
    };
    console.log(newMsg);
    // 로컬 상태값 업데이트
    setMessages((prevMsg) => [...prevMsg, newMsg]);
    // supabase 실시간 업데이트
    channel.current?.send({
      type: "broadcast",
      event: STREAM_EVENT_NAME,
      payload: newMsg,
    });
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    // prisma업데이트
  };
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
    <div className="grow pb-[50px] relative pt-[10px] overflow-y-auto flex flex-col">
      <div className="overflow-y-auto px-[10px]" ref={chatContainerRef}>
        {messages.map((msg) => (
          <ChatBubble
            isOwner={msg.user.id === userId}
            key={msg.id}
            avatar={msg.user.avatar}
            created_at={msg.created_at}
            payload={msg.payload}
            username={msg.user.username}
          />
        ))}
      </div>
      <StreamMessageForm sendMessage={onSubmit} />
    </div>
  );
};

export default StreamMessages;
