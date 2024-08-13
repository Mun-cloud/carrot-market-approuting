"use client";
import { InitialChatMessages } from "../page";
import ChatBubble from "@/components/chat-bubble";
import { useEffect, useRef, useState } from "react";
import { saveMessage } from "../../actions";
import {
  CHANNEL_EVENT_NAME,
  SUPABASE_PUBLIC_KEY,
  SUPABASE_URL,
} from "@/lib/constants";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import ChatSendForm from "./chat-send-form";

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
  const channel = useRef<RealtimeChannel>();

  const onSubmit = async (message: string) => {
    // 내가 보낸 메세지 상태값 추가(supabase의 broadcast는 기본적으로 내 자신에겐 알림이 가지 않음.)
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

    // supabase broadcast로 메세지 send
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
  };

  useEffect(() => {
    // supabase realtime으로 메세지 받기
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
    <div className="flex flex-col gap-5 p-5 grow justify-end">
      {messages.map((message) => (
        <ChatBubble
          avatar={message.user.avatar}
          isOwner={message.userId === userId}
          created_at={message.created_at}
          payload={message.payload}
          username={message.user.username}
          key={message.id}
        />
      ))}
      <ChatSendForm sendMessage={onSubmit} />
    </div>
  );
};

export default ChatMessagesList;
