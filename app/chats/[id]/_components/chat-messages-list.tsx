"use client";

import { useEffect, useRef, useState } from "react";
import { InitialChatMessages } from "../page";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { CHANNEL_EVENT_NAME } from "@/lib/constants";
import { saveMessage } from "../../actions";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y3hiaW90a29pZnVlemZ2andsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3NTA3ODEsImV4cCI6MjAzNzMyNjc4MX0.aX7EfcGrv0ljoCIpVE4jbLiGAFDGmSDlyZcAlkwiKY4";

const SUPABASE_URL = "https://ywcxbiotkoifuezfvjwl.supabase.co";

interface ChatMessagesListProps {
  chatRoomId: string;
  userId: number;
  initialMessages: InitialChatMessages;
  username: string;
  avatar: string | null;
}

const ChatMessagesList = ({
  chatRoomId,
  userId,
  initialMessages,
  username,
  avatar,
}: ChatMessagesListProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    await saveMessage(message, chatRoomId);
    channel.current?.send({
      type: "broadcast",
      event: CHANNEL_EVENT_NAME,
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: { username, avatar },
      },
    });
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: CHANNEL_EVENT_NAME }, (payload) => {
        console.log(payload);
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          data-owner={message.userId === userId ? "true" : "false"}
          className="flex gap-2 items-start data-[owner=true]:justify-end"
          key={message.id}
        >
          {message.userId !== userId && (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div className="flex flex-col gap-1 data-[owner=false]:items-end">
            <span className="bg-orange-500 p-2.5 rounded-md">
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
};

export default ChatMessagesList;
