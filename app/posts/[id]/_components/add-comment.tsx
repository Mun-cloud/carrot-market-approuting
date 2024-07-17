import { z } from "zod";
import { addComment } from "../actions";

interface Comment {
  created_at: Date;
  user: {
    username: string;
  };
  id: number;
  payload: string;
}

interface AddCommentProps {
  postId: number;
  commentsCount: number;
  reducerFn: (action: Comment) => void;
}

const postCommentSchema = z.object({
  payload: z.string(),
});

const AddComment = ({ postId, commentsCount, reducerFn }: AddCommentProps) => {
  const addCommentWithPostId = addComment.bind(null, postId);

  const handleSumbit = async (formData: FormData) => {
    const data = {
      payload: formData.get("payload"),
    };
    const result = postCommentSchema.safeParse(data);
    if (result.success) {
      addCommentWithPostId(result.data);
      reducerFn({
        created_at: new Date(),
        payload: result.data.payload,
        id: 0,
        user: {
          username: "you",
        },
      });
    } else {
      console.log(result.error.flatten());
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div>
        <span>댓글 입력</span>
        <span className="text-[14px]">{commentsCount}</span>
      </div>
      <form
        className="flex items-center justify-between gap-3"
        action={handleSumbit}
      >
        <div className="grow h-[60px] border rounded-md px-1 py-0.5">
          <textarea
            className="resize-none w-full h-full bg-transparent"
            name="payload"
          />
        </div>
        <button className="rounded-md border px-4 py-4 hover:border-transparent hover:bg-white hover:text-black transition-colors">
          등록
        </button>
      </form>
    </div>
  );
};

export default AddComment;
