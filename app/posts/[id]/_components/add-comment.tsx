import { z } from "zod";
import { addComment } from "../actions";

interface Comment {
  created_at: Date;
  user: {
    username: string;
  };
  payload: string;
}

interface AddCommentProps {
  postId: number;
  reducerFn: (action: Comment) => void;
}

const postCommentSchema = z.object({
  payload: z.string(),
  postId: z.number(),
  userId: z.number(),
});

const AddComment = ({ postId, reducerFn }: AddCommentProps) => {
  const addCommentWithPostId = addComment.bind(null, postId);

  const handleSumbit = (formData: FormData) => {
    const data = {
      payload: formData.get("payload"),
      postId: formData.get("postId"),
      userId: formData.get("userId"),
    };
    const result = postCommentSchema.safeParse(data);
    if (result.success) {
      reducerFn({
        created_at: new Date(),
        payload: result.data.payload,
        user: {
          username: "anan",
        },
      });
      addCommentWithPostId(result.data);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div>
        <span>댓글 입력</span>
        <span className="text-[14px]"></span>
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
