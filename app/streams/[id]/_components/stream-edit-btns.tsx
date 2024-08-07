"use client";

import { deleteStream, endStream } from "../actions";

interface StreamEditBtnsProps {
  id: number;
  streamId: string;
  isEnded: boolean;
}

const StreamEditBtns = ({ id, streamId, isEnded }: StreamEditBtnsProps) => {
  const onSubmit = (formData: FormData) => {
    if (confirm("삭제하시겠습니까?")) {
      deleteStream(formData);
    }
  };
  return (
    <div className="flex gap-2">
      {isEnded ? (
        <form action={onSubmit}>
          <input type="hidden" name="id" value={id} />
          <button className="border px-2 py-1 rounded-md border-red-500 hover:bg-red-500 hover:text-inherit hover:border-transparent transition-colors">
            delete stream video
          </button>
        </form>
      ) : (
        <form action={endStream}>
          <input type="hidden" className="hidden" name="id" value={id} />
          <input
            type="hidden"
            className="hidden"
            name="streamId"
            value={streamId}
          />
          <button className="border px-2 py-1 rounded-md border-orange-500 hover:bg-orange-500 hover:text-inherit hover:border-transparent transition-colors">
            end stream
          </button>
        </form>
      )}
    </div>
  );
};

export default StreamEditBtns;
