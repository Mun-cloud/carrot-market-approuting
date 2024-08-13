"use client";

import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
interface ChatSendFormProps {
  sendMessage: (message: string) => Promise<void>;
}

const ChatSendForm = ({ sendMessage }: ChatSendFormProps) => {
  const [message, setMessage] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage(message);
    setMessage("");
  };

  return (
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
  );
};

export default ChatSendForm;
