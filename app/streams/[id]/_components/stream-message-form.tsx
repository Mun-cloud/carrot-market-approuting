import { SendIcon } from "lucide-react";
import { FormEvent, useState } from "react";

interface StreamMessageFormProps {
  sendMessage: (payload: string) => Promise<void>;
}

const StreamMessageForm = ({ sendMessage }: StreamMessageFormProps) => {
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(message);
    setMessage("");
  };
  return (
    <form
      className="absolute bottom-0 w-full left-0 border-t h-[50px] flex items-center justify-center gap-3"
      onSubmit={onSubmit}
    >
      <input
        className="w-[80%] h-[35px] border rounded-full px-3 bg-transparent text-[14px] focus:outline-none ring-1 focus:border-orange-500 peer"
        required
        minLength={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="bg-neutral-400 py-1 px-2 rounded-full peer-valid:bg-orange-400 peer-valid:*:text-secondary">
        <SendIcon className="size-[20px] text-neutral-500" />
      </button>
    </form>
  );
};

export default StreamMessageForm;
